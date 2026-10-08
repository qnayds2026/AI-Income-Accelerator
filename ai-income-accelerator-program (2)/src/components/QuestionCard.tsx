import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question, Language, QuestionOption, UserResponses } from '../types';
import { IconRenderer } from './IconRenderer';
import {
  Check,
  CheckCircle2,
  Sparkles,
  User,
  Mail,
  Phone,
  Briefcase,
  IndianRupee,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  language: Language;
  responses: UserResponses;
  onOptionSelect: (questionId: keyof UserResponses, optionId: string) => void;
  onInputChange: (fieldId: keyof UserResponses, value: string) => void;
  errorMessage?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  language,
  responses,
  onOptionSelect,
  onInputChange,
  errorMessage,
}) => {
  const currentAnswer = responses[question.id] || '';
  const isMalayalam = language === 'ml';
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input fields when question changes
  useEffect(() => {
    if (
      question.type === 'text-input' ||
      question.type === 'tel-input' ||
      question.type === 'email-input'
    ) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [question.id, question.type]);

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full flex flex-col"
    >
      {/* Question Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3 h-3" />
            {isMalayalam ? question.categoryMl : question.categoryEn}
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
            {question.questionNumber} / 12
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight leading-snug mb-2">
          {isMalayalam ? question.titleMl : question.titleEn}
        </h2>

        {(question.subtitleEn || question.subtitleMl) && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isMalayalam ? question.subtitleMl : question.subtitleEn}
          </p>
        )}
      </div>

      {/* Input Questions (Full Name, Contact Number, Email, Occupation) */}
      {(question.type === 'text-input' || question.type === 'tel-input' || question.type === 'email-input') && (
        <div className="mb-6 flex flex-col gap-2">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
              {question.type === 'email-input' && <Mail className="w-5 h-5" />}
              {question.type === 'tel-input' && <Phone className="w-5 h-5" />}
              {question.type === 'text-input' && (
                question.id === 'occupation' ? <Briefcase className="w-5 h-5" /> :
                (question.id === 'currentSalary' || question.id === 'willingToInvest') ? <IndianRupee className="w-5 h-5" /> :
                <User className="w-5 h-5" />
              )}
            </div>

            <input
              ref={inputRef}
              id={`input-${question.id}`}
              type={question.type === 'email-input' ? 'email' : question.type === 'tel-input' ? 'tel' : 'text'}
              value={currentAnswer}
              placeholder={isMalayalam ? question.placeholderMl : question.placeholderEn}
              onChange={(e) => onInputChange(question.id, e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl bg-white border text-base sm:text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs transition-all ${
                errorMessage
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900'
                  : 'border-slate-200 focus:border-blue-600'
              }`}
            />
          </div>

          {errorMessage && (
            <p className="text-xs sm:text-sm text-rose-600 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </p>
          )}
        </div>
      )}

      {/* Choice Options (Questions 5 to 12) */}
      {question.type === 'single-choice' && question.options && (
        <div className="grid grid-cols-1 gap-3 sm:gap-3.5 mb-6">
          {question.options.map((option: QuestionOption, index: number) => {
            const isSelected = currentAnswer === option.id;
            const letter = optionLetters[index] || `${index + 1}`;

            return (
              <button
                key={option.id}
                id={`option-${question.id}-${option.id}`}
                type="button"
                onClick={() => onOptionSelect(question.id, option.id)}
                className={`w-full group text-left p-4 sm:p-4.5 rounded-xl border transition-all duration-200 flex items-start gap-3.5 relative overflow-hidden shadow-xs ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600/30 shadow-md shadow-blue-500/5'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Visual side highlight when selected */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600" />
                )}

                {/* Letter Key / Icon badge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 font-medium'
                  }`}
                >
                  <IconRenderer name={option.iconName || 'Sparkles'} className="w-5 h-5" />
                </div>

                {/* Option text content */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded border transition-colors ${
                        isSelected
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {letter}
                    </span>
                    <span
                      className={`font-semibold text-sm sm:text-base leading-tight transition-colors ${
                        isSelected ? 'text-blue-950' : 'text-slate-800 group-hover:text-blue-900'
                      }`}
                    >
                      {isMalayalam ? option.labelMl : option.labelEn}
                    </span>
                  </div>

                  {(option.descriptionEn || option.descriptionMl) && (
                    <p className={`text-xs sm:text-sm leading-relaxed ${isSelected ? 'text-blue-900/80' : 'text-slate-500'}`}>
                      {isMalayalam ? option.descriptionMl : option.descriptionEn}
                    </p>
                  )}
                </div>

                {/* Check indicator circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all mt-1 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-xs'
                      : 'border-slate-300 bg-white text-transparent group-hover:border-blue-400'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Helpful Hint banner */}
      {(question.hintEn || question.hintMl) && (
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-blue-50/50 border border-blue-100 px-3.5 py-2.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{isMalayalam ? question.hintMl : question.hintEn}</span>
        </div>
      )}
    </motion.div>
  );
};
