import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/session";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  const hasEndedRef = useRef(false);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      try {
        const { token, userId, userName, userImage } =
          await sessionApi.getStreamToken();

        // Initialize Stream video client
        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );

        setStreamClient(client);

        // Join video call
        videoCall = client.call("default", session.callId);
        await videoCall.join();
        setCall(videoCall);

        // Initialize chat client
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );

        setChatClient(chatClientInstance);

        // Watch chat channel
        const chatChannel = chatClientInstance.channel(
          "messaging",
          session.callId,
        );

        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (session && !loadingSession) {
      initCall();
    }

    return () => {
      (async () => {
        try {
          // End session if host leaves
          if (isHost && session?._id && !hasEndedRef.current) {
            hasEndedRef.current = true;
            await sessionApi.endSession(session._id);
          }

          if (videoCall && videoCall.state?.callingState !== "left") {
            await videoCall.leave();
          }

          if (chatClientInstance) {
            await chatClientInstance.disconnectUser();
          }

          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, loadingSession, isHost, isParticipant]);

  // Handle browser tab close
  useEffect(() => {
    const handleUnload = () => {
      if (isHost && session?._id) {
        sessionApi.endSession(session._id);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [session, isHost]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
