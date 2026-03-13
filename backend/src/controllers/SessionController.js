import Session from "../models/Session.js";
import { streamClient } from "../lib/stream.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;

    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // generate a unique call id and stream video

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();
    res.status(201).json(session);
  } catch (error) {
    console.log("Error in create session", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

export async function getActiveSession(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in create session", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
}
export async function getMyRecentSession(req, res) {
  try {
    // where user either host or participant

    const userId = req.user._id;

    await Session.find({
      status: "completed",
      $or: [{ host: userId }, { particiapnt: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in create session", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerId")
      .populate("particiapnt", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in create session", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if the session is full
    if (session.participant)
      return res.status(404).json({ message: "Session is full." });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);

    await channel.addMembers([clerkId]);
    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in create session", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
}
export async function endSession(req, res) {
    try{
        const{id} = req.params
        const userId = req.user._id
        const session  = await Session.findById(id)

        if (!session) return res.status(404).json({ message: "Session not found" });

        // check user is host or not

        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({message:"Only host can end the session"})
        }
        // check the session isalready completed 
        if(session.status == "completd"){
          return res.status(404).json({message: "Session is completed."})
        }

        session.status = "completd"
        session.save()

        // delete the video call started
        const call = streamClient.video.call("default", session.callId)

        await call.delete({hard: true})

        // delete the chat 
        const chat = streamClient.channel("messaging", session.callId)

        await channel.delete({hard: true})

        return res.status(200).json({session, message:"Session ended successfully."})


    }catch (error) {
    console.log("Error in create session", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
}
