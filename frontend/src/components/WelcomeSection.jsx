import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between flex-wrap gap-6">
        {/* LEFT TEXT */}
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Welcome back, {user?.firstName || "there"}
          </h1>

          <p className="text-base text-base-content/60 mt-1">
            Ready to practice your next coding interview?
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={onCreateSession}
          className="btn btn-outline btn-primary gap-2"
        >
          
          Create Session
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default WelcomeSection;
