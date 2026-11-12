import React from 'react';
import { RecommendedPlan, UserResponses, Language } from '../types';
import {
  CheckCircle2,
  RotateCcw,
  Calendar,
  Clock,
  Video,
} from 'lucide-react';
import { CALENDLY_MEETING_URL } from '../config/constants';

interface RoadmapResultViewProps {
  plan: RecommendedPlan;
  responses: UserResponses;
  language: Language;
  onRetake: () => void;
}

export const RoadmapResultView: React.FC<RoadmapResultViewProps> = ({
  plan,
  responses,
  language,
  onRetake,
}) => {
  const isMalayalam = language === 'ml';

  // Pre-fill Name and Email from the 12-question responses
  const getCalendlyUrlWithPrefill = () => {
    try {
      const url = new URL(CALENDLY_MEETING_URL);
      if (responses.fullName?.trim()) {
        url.searchParams.set('name', responses.fullName.trim());
      }
      if (responses.email?.trim()) {
        url.searchParams.set('email', responses.email.trim());
      }
      return url.toString();
    } catch {
      return CALENDLY_MEETING_URL;
    }
  };

  const calendlyFinalUrl = getCalendlyUrlWithPrefill();
  const hasSpecificCalendlyEvent =
    CALENDLY_MEETING_URL.startsWith('https://calendly.com/') &&
    CALENDLY_MEETING_URL.replace('https://calendly.com/', '').trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Calendly 1-on-1 Meeting Booking Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-blue-600/20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 p-5 sm:p-7 shadow-xl shadow-blue-500/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isMalayalam
                  ? 'അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു — അടുത്ത ഘട്ടം'
                  : 'Submitted Successfully — Next Step'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {isMalayalam
                ? 'നിങ്ങളുടെ 1-on-1 മീറ്റിംഗ് ഇപ്പോൾ ഷെഡ്യൂൾ ചെയ്യുക (Calendly)'
                : 'Schedule Your 1-on-1 Strategy Meeting on Calendly'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              {isMalayalam
                ? 'നിങ്ങൾക്ക് അനുയോജ്യമായ സമയവും തീയതിയും തിരഞ്ഞെടുത്ത് ഞങ്ങളുടെ മെന്ററുമായി നേരിട്ട് സംസാരിക്കാൻ താഴെ കാണുന്ന കലണ്ടർ വഴി മീറ്റിംഗ് ബുക്ക് ചെയ്യുക.'
                : 'Pick a convenient date and time slot on Calendly to speak directly with our mentor about your personalized AI income roadmap.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                <Video className="w-3.5 h-3.5 text-blue-600" />
                {isMalayalam ? 'ഓൺലൈൻ വീഡിയോ മീറ്റിംഗ്' : 'Online Video Call'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {isMalayalam ? 'ഇഷ്ടമുള്ള സമയം തിരഞ്ഞെടുക്കാം' : 'Choose Your Preferred Slot'}
              </span>
            </div>
          </div>
        </div>

        {/* Inline Calendly Embed when a specific event link is provided */}
        {hasSpecificCalendlyEvent && (
          <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner">
            <iframe
              src={`${calendlyFinalUrl}${calendlyFinalUrl.includes('?') ? '&' : '?'}hide_gdpr_banner=1`}
              title="Schedule Calendly Meeting"
              className="w-full h-[640px] border-0"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-center pt-4 border-t border-slate-200">
        <button
          id="retake-assessment-btn"
          type="button"
          onClick={onRetake}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/50 text-xs font-medium text-slate-700 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
          <span>{isMalayalam ? 'വീണ്ടും ചെയ്യുക' : 'Retake'}</span>
        </button>
      </div>
    </div>
  );
};
