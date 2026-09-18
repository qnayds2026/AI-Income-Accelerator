import React from 'react';
import { Language } from '../types';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';

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
  const isMalayalam = language === 'ml';
  const isLastQuestion = currentStep === totalSteps - 1;

  return (
    <div className="w-full pt-4 pb-8 sm:pb-12 border-t border-slate-200 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Back button */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
        {currentStep > 0 ? (
          <button
            id="prev-question-btn"
            type="button"
            onClick={onPrev}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>{isMalayalam ? 'പുറകോട്ട്' : 'Previous'}</span>
          </button>
        ) : (
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            {isMalayalam ? `ചോദ്യം 1 / ${totalSteps}` : `Step 1 of ${totalSteps}`}
          </div>
        )}

        <div className="sm:hidden text-xs text-slate-400 font-medium">
          {currentStep + 1} / {totalSteps}
        </div>
      </div>

      {/* Next / Submit button */}
      <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
        <button
          id="next-question-btn"
          type="button"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md ${
            canProceed && !isSubmitting
              ? isLastQuestion
                ? 'bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 shadow-emerald-500/20 active:scale-[0.98] cursor-pointer ring-1 ring-emerald-400/40'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 active:scale-[0.98] cursor-pointer ring-1 ring-blue-500/30'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{isMalayalam ? 'സബ്മിറ്റ് ചെയ്യുന്നു... വാട്സ്ആപ്പിലേക്ക്...' : 'Submitting... Opening WhatsApp...'}</span>
            </>
          ) : isLastQuestion ? (
            <>
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span className="font-bold">{isMalayalam ? 'സബ്മിറ്റ് ചെയ്ത് വാട്സ്ആപ്പ് ഗ്രൂപ്പിൽ ചേരുക' : 'Submit & Join WhatsApp Group'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>{isMalayalam ? 'അടുത്ത ചോദ്യം' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
