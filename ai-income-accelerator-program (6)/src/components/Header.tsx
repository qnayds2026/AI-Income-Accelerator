import React from 'react';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  isResultView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps,
  isResultView = false,
}) => {
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <header className="w-full border-b border-blue-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col gap-3">
        {/* Top brand row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-sm sm:text-base text-blue-950 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              AI Income Accelerator
            </span>
          </div>
        </div>

        {/* Progress bar (only when answering questions) */}
        {!isResultView && (
          <div className="flex flex-col gap-1.5 pt-0.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="font-mono text-blue-600 text-[11px] font-bold">
                {progressPercent}% Completed
              </span>
            </div>
            {/* Smooth bar */}
            <div className="w-full h-1.5 bg-blue-100/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
