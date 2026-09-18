import React from 'react';
import { RecommendedPlan, UserResponses, Language } from '../types';
import {
  CheckCircle2,
  RotateCcw,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { WHATSAPP_GROUP_URL, WHATSAPP_GROUP_NAME } from '../config/constants';

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

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* WhatsApp Community Join Card */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-5 sm:p-6 shadow-lg shadow-blue-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#25D366] text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <MessageCircle className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{isMalayalam ? 'അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു' : 'Submitted Successfully'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {isMalayalam ? `${WHATSAPP_GROUP_NAME} വാട്സ്ആപ്പ് ഗ്രൂപ്പിൽ ചേരുക` : `Join ${WHATSAPP_GROUP_NAME} WhatsApp Group`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {isMalayalam
                  ? 'ക്ലാസ്സ് ഷെഡ്യൂളുകൾ, ലൈവ് ലിങ്കുകൾ, സംശയനിവാരണം എന്നിവയ്ക്കായി ഉടൻ ഞങ്ങളുടെ ഔദ്യോഗിക വാട്സ്ആപ്പ് ഗ്രൂപ്പിൽ അംഗമാകൂ.'
                  : 'Get immediate batch dates, live session links, mentor assistance, and resource templates in our official WhatsApp group.'}
              </p>
            </div>
          </div>

          <a
            id="join-whatsapp-group-top-btn"
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              try {
                if (typeof window !== 'undefined') {
                  const win = window as unknown as {
                    fbq?: (...args: unknown[]) => void;
                    gtag?: (...args: unknown[]) => void;
                  };
                  if (win.fbq) win.fbq('track', 'Contact');
                  if (win.gtag) win.gtag('event', 'join_group', { method: 'WhatsApp' });
                }
              } catch {}
            }}
            className="w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-slate-950" />
            <span>{isMalayalam ? 'വാട്സ്ആപ്പ് ഗ്രൂപ്പിൽ ചേരുക' : 'Join WhatsApp Group'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
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
