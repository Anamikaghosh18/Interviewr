import { chatClient } from "../lib/stream.js";
export async function getStreamToken(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const token = chatClient.createToken(req.user.clerkId);

    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.profileImage, // <-- important fix
    });
  } catch (error) {
    console.log("STREAM TOKEN ERROR:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}