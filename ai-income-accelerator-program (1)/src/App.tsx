/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { QUESTIONS_DATA } from './data/questions';
import { Language, UserResponses, RecommendedPlan } from './types';
import { generatePersonalizedRoadmap } from './utils/roadmapGenerator';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { NavigationControls } from './components/NavigationControls';
import { RoadmapResultView } from './components/RoadmapResultView';
import { WHATSAPP_GROUP_URL } from './config/constants';
import { submitLeadToSheet } from './services/leadSubmission';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'ai_money_course_quiz_data_v2';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language) return parsed.language;
      }
    } catch (e) {
      // Ignore storage errors
    }
    return 'en'; // Default to English as requested
  });
  const [responses, setResponses] = useState<UserResponses>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.responses || {};
      }
    } catch (e) {
      // Ignore storage errors
    }
    return {};
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.isCompleted || false;
      }
    } catch (e) {
      // Ignore
    }
    return false;
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ responses, isCompleted, currentStep, language })
      );
    } catch (e) {
      // Ignore
    }
  }, [responses, isCompleted, currentStep, language]);

  const currentQuestion = QUESTIONS_DATA[currentStep];

  // Validate if user can proceed to next step
  const validateCurrentStep = useCallback((): boolean => {
    if (!currentQuestion) return false;
    const isMalayalam = language === 'ml';

    if (currentQuestion.id === 'fullName') {
      const val = responses.fullName?.trim() || '';
      if (!val || val.length < 2) {
        setErrorMessage(isMalayalam ? 'ദയവായി നിങ്ങളുടെ മുഴുവൻ പേര് നൽകുക' : 'Please enter your full name');
        return false;
      }
    }

    if (currentQuestion.id === 'phone') {
      const val = responses.phone?.trim() || '';
      if (!val || val.length < 7) {
        setErrorMessage(isMalayalam ? 'ശരിയായ മൊബൈൽ നമ്പർ നൽകുക (കുറഞ്ഞത് 7 അക്കങ്ങൾ)' : 'Please enter a valid phone number');
        return false;
      }
    }

    if (currentQuestion.id === 'email') {
      const val = responses.email?.trim() || '';
      if (!val || !val.includes('@') || !val.includes('.')) {
        setErrorMessage(isMalayalam ? 'ശരിയായ ഇമെയിൽ വിലാസം നൽകുക' : 'Please enter a valid email address');
        return false;
      }
    }

    if (currentQuestion.id === 'occupation') {
      const val = responses.occupation?.trim() || '';
      if (!val || val.length < 2) {
        setErrorMessage(isMalayalam ? 'ദയവായി നിങ്ങളുടെ തൊഴിൽ നൽകുക' : 'Please enter your current job / occupation');
        return false;
      }
    }

    if (currentQuestion.id === 'currentSalary') {
      const val = responses.currentSalary?.trim() || '';
      if (!val) {
        setErrorMessage(isMalayalam ? 'ദയവായി നിങ്ങളുടെ പ്രതിമാസ ശമ്പളം നൽകുക (വരുമാനമില്ലെങ്കിൽ 0 എന്ന് നൽകാം)' : 'Please enter your monthly salary (or 0 if no current income)');
        return false;
      }
    }

    if (currentQuestion.id === 'willingToInvest') {
      const val = responses.willingToInvest?.trim() || '';
      if (!val) {
        setErrorMessage(isMalayalam ? 'ദയവായി നിങ്ങൾ നിക്ഷേപിക്കാൻ തയ്യാറുള്ള തുക നൽകുക' : 'Please enter the amount you are willing to invest');
        return false;
      }
    }

    if (currentQuestion.type === 'single-choice') {
      const val = responses[currentQuestion.id];
      if (!val) {
        setErrorMessage(isMalayalam ? 'മുന്നോട്ട് പോകാൻ ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക' : 'Please select an option to continue');
        return false;
      }
    }

    setErrorMessage('');
    return true;
  }, [currentQuestion, responses, language]);

  // Handle option selection
  const handleOptionSelect = (questionId: keyof UserResponses, optionId: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    setErrorMessage('');
  };

  // Handle input change
  const handleInputChange = (fieldId: keyof UserResponses, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Step advancement
  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep === QUESTIONS_DATA.length - 1) {
      // Final 12th Question submission
      setIsSubmitting(true);

      // Trigger Meta Pixel & Google Analytics Lead event for Ad conversions
      try {
        if (typeof window !== 'undefined') {
          const win = window as unknown as {
            fbq?: (...args: unknown[]) => void;
            gtag?: (...args: unknown[]) => void;
          };
          if (win.fbq) {
            win.fbq('track', 'Lead', {
              content_name: 'AI Income Accelerator Assessment',
              value: 0,
              currency: 'INR',
            });
          }
          if (win.gtag) {
            win.gtag('event', 'generate_lead', {
              event_category: 'form',
              event_label: 'AI Income Accelerator Assessment',
            });
          }
        }
      } catch (e) {
        console.warn('Analytics tracking error:', e);
      }

      // Submit lead responses to Google Sheet backend proxy
      submitLeadToSheet(responses, recommendedPlan).catch((err) => {
        console.error('Lead submission caught error:', err);
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setIsCompleted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Open WhatsApp group
        try {
          window.open(WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
        } catch (err) {
          console.error('Could not auto-open WhatsApp group:', err);
        }
      }, 700);
      return;
    }

    if (currentStep < QUESTIONS_DATA.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setErrorMessage('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrorMessage('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    if (window.confirm(language === 'ml' ? 'ആദ്യ ചോദ്യം മുതൽ വീണ്ടും തുടങ്ങണോ?' : 'Restart questionnaire from Question 1?')) {
      setCurrentStep(0);
      setIsCompleted(false);
      setResponses({});
      setErrorMessage('');
      localStorage.removeItem(STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetake = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation: Enter key triggers Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const recommendedPlan: RecommendedPlan = generatePersonalizedRoadmap(responses);

  // Check if current question has an answer ready
  const isAnswered = Boolean(responses[currentQuestion?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-500/20 selection:text-blue-700">
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        totalSteps={QUESTIONS_DATA.length}
        isResultView={isCompleted}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto px-4 sm:px-6 py-8">
        {!isCompleted ? (
          <div className="w-full">
            {/* Question Step Card with Animation */}
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <QuestionCard
                  key={currentQuestion.id}
                  question={currentQuestion}
                  language={language}
                  responses={responses}
                  onOptionSelect={handleOptionSelect}
                  onInputChange={handleInputChange}
                  errorMessage={errorMessage}
                />
              )}
            </AnimatePresence>

            {/* Next / Previous Controls */}
            <NavigationControls
              currentStep={currentStep}
              totalSteps={QUESTIONS_DATA.length}
              canProceed={true}
              onNext={handleNext}
              onPrev={handlePrev}
              language={language}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          /* Final Personalized Course Roadmap View */
          <RoadmapResultView
            plan={recommendedPlan}
            responses={responses}
            language={language}
            onRetake={handleRetake}
          />
        )}
      </main>

      {/* Trust Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/90 backdrop-blur-md py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-slate-600 font-medium">
              {language === 'ml'
                ? 'പ്രൊഫഷണൽ AI ട്രെയിനിംഗ് & ലൈവ് മെന്റർഷിപ്പ് പ്രോഗ്രാം'
                : 'Certified AI Monetization & Practical Skill Accelerator'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {language === 'ml' ? 'സീറ്റുകൾ പരിമിതമാണ് • അടുത്ത ബാച്ച് ഉടൻ ആരംഭിക്കുന്നു' : 'Limited Seats • Next Cohort Starting Soon'}
          </div>
        </div>
      </footer>
    </div>
  );
}
