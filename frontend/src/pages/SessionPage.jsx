import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2Icon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import ProblemDescription from "../components/ProblemDescription";
import useStreamClient from "../hooks/useStreamSessions";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

const ALL_PROBLEMS = Object.entries(PROBLEMS).map(([id, p]) => ({ id, ...p }));

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } =
    useStreamClient(session, loadingSession, isHost, isParticipant);

  const [currentProblemId, setCurrentProblemId] = useState(ALL_PROBLEMS[0]?.id);
  const problemData = PROBLEMS[currentProblemId];

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.["javascript"] || "");

  // Auto-join session
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // Redirect participant when session ends
  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // Sync problem from session once loaded
  useEffect(() => {
    if (!session?.problem) return;
    const foundId = Object.entries(PROBLEMS).find(
      ([, p]) => p.title === session.problem
    )?.[0];
    if (foundId) setCurrentProblemId(foundId);
  }, [session?.problem]);

  // Update code when problem or language changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [currentProblemId, selectedLanguage]);

  const handleProblemChange = (newProblemId) => {
    setCurrentProblemId(newProblemId);
    setOutput(null);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(problemData?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  if (loadingSession) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100">
        <Loader2Icon className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar>
        {isHost && (
          <button
            className="btn btn-error btn-sm"
            onClick={handleEndSession}
            disabled={endSessionMutation.isPending}
          >
            {endSessionMutation.isPending
              ? <Loader2Icon className="size-4 animate-spin" />
              : "End Session"
            }
          </button>
        )}
      </Navbar>

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" style={{ height: "100%" }}>

          {/* LEFT: Problem Description */}
          <Panel defaultSize={30} minSize={20} style={{ overflow: "hidden" }}>
            {problemData ? (
              <ProblemDescription
                problem={problemData}
                currentProblemId={currentProblemId}
                onProblemChange={handleProblemChange}
                allProblems={ALL_PROBLEMS}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-base-content/50">
                No problem selected.
              </div>
            )}
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* MIDDLE: Code Editor + Output */}
          <Panel defaultSize={40} minSize={25} style={{ overflow: "hidden" }}>
            <PanelGroup direction="vertical" style={{ height: "100%" }}>

              <Panel defaultSize={65} minSize={30} style={{ overflow: "hidden" }}>
                <CodeEditorPanel
                  code={code}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  isRunning={isRunning}
                />
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={35} minSize={15} style={{ overflow: "hidden" }}>
                <OutputPanel output={output} isRunning={isRunning} />
              </Panel>

            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT: Video Call */}
          <Panel defaultSize={30} minSize={20} style={{ overflow: "hidden" }}>
            <div className="h-full bg-base-200 p-4 flex items-center justify-center">
              {isInitializingCall || !call ? (
                <div className="text-center">
                  <Loader2Icon className="w-12 h-12 animate-spin text-primary mb-4" />
                  <p className="text-lg">
                    {isInitializingCall ? "Connecting to video call..." : "Joining call..."}
                  </p>
                </div>
              ) : (
                <StreamVideo client={streamClient}>
                  <StreamCall call={call}>
                    <VideoCallUI chatClient={chatClient} channel={channel} />
                  </StreamCall>
                </StreamVideo>
              )}
            </div>
          </Panel>

        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;