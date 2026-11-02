import { UserResponses, RecommendedPlan } from '../types';
import { DEFAULT_GOOGLE_SHEET_WEBHOOK_URL } from '../config/constants';

export interface FormattedLeadPayload {
  timestamp: string;
  fullName: string;
  phone: string;
  email: string;
  occupation: string;
  currentSalary: string;
  salarySatisfied: string;
  usingAiTools: string;
  interestedInAiSkills: string;
  targetAdditionalIncome: string;
  willingToDedicateTime: string;
  readyToPay: string;
  willingToInvest: string;
  readyToPay10000: string;
  recommendedTrack: string;
  [key: string]: string;
}

export function formatLeadData(
  responses: UserResponses,
  plan?: RecommendedPlan
): FormattedLeadPayload {
  // Format target income nicely
  let targetIncome = responses.targetAdditionalIncome || '';
  if (targetIncome === '10000') targetIncome = '₹10,000 / month';
  else if (targetIncome === '15000') targetIncome = '₹15,000 / month';
  else if (targetIncome === '20000') targetIncome = '₹20,000 / month';

  const answer12 = responses.willingToInvest?.trim() || '';

  return {
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    fullName: responses.fullName?.trim() || '',
    phone: responses.phone?.trim() || '',
    email: responses.email?.trim() || '',
    occupation: responses.occupation?.trim() || '',
    currentSalary: responses.currentSalary?.trim() || '',
    salarySatisfied: responses.salarySatisfied || '',
    usingAiTools: responses.usingAiTools || '',
    interestedInAiSkills: responses.interestedInAiSkills || '',
    targetAdditionalIncome: targetIncome,
    willingToDedicateTime: responses.willingToDedicateTime || '',
    readyToPay: responses.readyToPay || '',
    willingToInvest: answer12,
    readyToPay10000: answer12,
    // Matching common Google Sheet column headers
    'Are you ready to pay atleast ₹10000 to learn ai income skills to earn ₹50000/month,if you find the course is worth for you?': answer12,
    '12. Are you ready to pay atleast ₹10000 to learn ai income skills to earn ₹50000/month,if you find the course is worth for you?': answer12,
    'If you had the potential to earn ₹50,000 per month using the skills you learn, how much would you be willing to invest in your learning?': answer12,
    '12. If you had the potential to earn ₹50,000 per month using the skills you learn, how much would you be willing to invest in your learning?': answer12,
    'Ready to pay ₹10,000': answer12,
    'Ready to pay 10000': answer12,
    'Q12': answer12,
    recommendedTrack: plan?.trackNameEn || 'AI Income Accelerator',
  };
}

export async function submitLeadToSheet(
  responses: UserResponses,
  plan?: RecommendedPlan
): Promise<{ success: boolean; forwarded?: boolean; message?: string }> {
  const payload = formatLeadData(responses, plan);

  // Backup in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('ai_course_leads_backup') || '[]');
    existing.push(payload);
    localStorage.setItem('ai_course_leads_backup', JSON.stringify(existing));
  } catch (e) {
    console.warn('LocalStorage backup error:', e);
  }

  // 1. Submit through backend proxy API
  let serverForwarded = false;
  try {
    const res = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.forwarded) {
        return data;
      }
      serverForwarded = Boolean(data.forwarded);
    }
  } catch (apiError) {
    console.warn('Backend API submission failed or unavailable:', apiError);
  }

  // 2. Client-side fallback direct to Google Sheet Webhook URL
  if (!serverForwarded) {
    const clientWebhookUrl =
      import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
    if (clientWebhookUrl && clientWebhookUrl.trim() !== '') {
      try {
        await fetch(clientWebhookUrl.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        return { success: true, forwarded: true, message: 'Forwarded directly from client' };
      } catch (clientErr) {
        console.warn('Client-side direct webhook failed:', clientErr);
      }
    }
  }

  return { success: true, forwarded: serverForwarded, message: 'Saved in local backup' };
}
