import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems.js";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-base-100 border border-base-300 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Code2Icon className="size-6 text-primary" />
          <h3 className="font-bold text-2xl text-base-content">
            Create New Session
          </h3>
        </div>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold text-base-content">
                Select Problem
              </span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find(
                  (p) => p.title === e.target.value,
                );

                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/30 flex gap-3 items-start">
              <Code2Icon className="size-5 text-success mt-1" />

              <div className="text-sm">
                <p className="font-semibold text-base-content">Room Summary</p>

                <p className="text-base-content/70">
                  Problem:{" "}
                  <span className="font-medium text-base-content">
                    {roomConfig.problem}
                  </span>
                </p>

                <p className="text-base-content/70">
                  Max Participants:{" "}
                  <span className="font-medium text-base-content">
                    2 (1-on-1 session)
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="modal-action mt-8">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2 transition-all duration-200 hover:scale-[1.03] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default CreateSessionModal;
