import React from "react";
import { Language } from "../types";
import { ArrowLeft, ArrowRight, CalendarCheck } from "lucide-react";

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  language: Language;
  isSubmitting?: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  totalSteps,
  canProceed,
  onNext,
  onPrev,
  language,
  isSubmitting = false,
}) => {
  const isLastQuestion = currentStep === totalSteps - 1;

  const handleButtonClick = () => {
    if (isLastQuestion) {
      if (
        typeof window !== "undefined" &&
        typeof (window as any).fbq === "function"
      ) {
        (window as any).fbq("track", "Purchase");
        console.log("Purchase event fired");
      }
    }

    onNext();
  };

  return (
    <div className="w-full pt-4 pb-8 sm:pb-12 border-t border-slate-200 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      
      <div className="w-full sm:w-auto">
        {currentStep > 0 ? (
          <button
            id="prev-question-btn"
            type="button"
            onClick={onPrev}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : (
          <div className="text-xs text-slate-400 font-medium">
            Step 1 of {totalSteps}
          </div>
        )}
      </div>

      <div className="w-full sm:w-auto">
        <button
          id="submit-book-meeting-btn"
          type="button"
          onClick={handleButtonClick}
          disabled={!canProceed || isSubmitting}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md ${
            canProceed && !isSubmitting
              ? isLastQuestion
                ? "bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 cursor-pointer"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span>Submitting...</span>
          ) : isLastQuestion ? (
            <>
              <CalendarCheck className="w-4 h-4" />
              <span className="font-bold">Submit &amp; Book Meeting</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
