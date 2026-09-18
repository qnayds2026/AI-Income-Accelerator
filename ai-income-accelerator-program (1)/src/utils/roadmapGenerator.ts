import { RecommendedPlan, UserResponses } from '../types';

export function generatePersonalizedRoadmap(responses: UserResponses): RecommendedPlan {
  const isBeginner = responses.usingAiTools === 'No' || !responses.usingAiTools;
  const isHighTarget = responses.targetAdditionalIncome === '20000' || responses.targetAdditionalIncome === '30000_plus';
  const readyToInvest = responses.readyToPay === 'Yes';
  const targetIncome = responses.targetAdditionalIncome === '30000_plus'
    ? '₹30,000 – ₹50,000'
    : responses.targetAdditionalIncome === '20000'
    ? '₹20,000 – ₹35,000'
    : responses.targetAdditionalIncome === '15000'
    ? '₹15,000 – ₹25,000'
    : '₹10,000 – ₹20,000';

  let trackNameEn = 'AI High-Income Freelance & Side Income Track';
  let trackNameMl = 'AI ഹൈ-ഇൻകം ഫ്രീലാൻസ് & സൈഡ് ഇൻകം ട്രാക്ക്';
  let trackTaglineEn = `Master practical AI tools in 2 hours/week to consistently earn ${targetIncome}/month supplementary income.`;
  let trackTaglineMl = `ആഴ്ചയിൽ 2 മണിക്കൂർ പരിശീലനത്തിലൂടെ പ്രതിമാസം ${targetIncome} അധിക വരുമാനം നേടാനുള്ള പ്രായോഗിക പരിശീലനം.`;

  if (isHighTarget) {
    trackNameEn = 'High-Ticket AI Services & Automation Agency Blueprint';
    trackNameMl = 'ഹൈ-ടിക്കറ്റ് AI സർവീസസ് & ഓട്ടോമേഷൻ ഏജൻസി ബ്ലൂപ്രിന്റ്';
    trackTaglineEn = 'Scale from beginner prompts to high-paying client automation workflows and recurring retainers.';
    trackTaglineMl = 'ലളിതമായ പ്രോംപ്റ്റുകളിൽ നിന്ന് ആരംഭിച്ച് സ്ഥിരമായ ക്ലയന്റുകൾക്ക് ഓട്ടോമേഷൻ നൽകി ഉയർന്ന വരുമാനം നേടുക.';
  }

  // Calculate tailored readiness score
  let baseScore = 76;
  if (responses.interestedInAiSkills === 'Yes') baseScore += 8;
  if (responses.willingToDedicateTime === 'Yes') baseScore += 8;
  if (responses.readyToPay === 'Yes') baseScore += 4;
  if (responses.usingAiTools === 'Yes') baseScore += 3;
  const readinessScore = Math.min(baseScore, 99);

  const modules = [
    {
      titleEn: 'Foundations of Monetizable AI & Smart Prompt Engineering',
      titleMl: 'വരുമാനദായകമായ AI അടിസ്ഥാനങ്ങളും പ്രോംപ്റ്റ് എഞ്ചിനീയറിംഗും',
      duration: 'Week 1 - 2',
      description: 'Zero-shot to master prompt frameworks, ChatGPT, Claude, and Gemini techniques for commercial grade output.',
    },
    {
      titleEn: 'High-Demand AI Services: Content, Bots & Digital Workflows',
      titleMl: 'കൂടുതൽ ഡിമാൻഡുള്ള AI സേവനങ്ങൾ: കണ്ടന്റ്, ബോട്ടുകൾ, ഡിജിറ്റൽ വർക്ക്ഫ്ലോകൾ',
      duration: 'Week 3 - 4',
      description: 'Build practical solutions: custom customer support assistants, SEO content systems, and automated image/media generation.',
    },
    {
      titleEn: 'Client Acquisition, Pricing Strategy & Outreach Templates',
      titleMl: 'ക്ലയന്റുകളെ കണ്ടെത്താനുള്ള പ്രായോഗിക തന്ത്രങ്ങളും പ്രൊപ്പോസലുകളും',
      duration: 'Week 5 - 6',
      description: 'Proven cold DM/email templates, LinkedIn optimization, closing local business and international freelance clients.',
    },
    {
      titleEn: 'Delivery, Revisions & Building Monthly Recurring Retainers',
      titleMl: 'സ്ഥിരമായ മാസവരുമാനം (Monthly Retainers) ഉറപ്പാക്കൽ',
      duration: 'Week 7 - 8',
      description: 'How to turn one-time ₹5,000 - ₹15,000 projects into steady monthly maintenance retainers.',
    },
  ];

  const threeMonthRoadmap = [
    {
      month: 'Month 1: Practical Skill Mastery',
      focus: isBeginner ? 'Zero-to-Hero AI Tool Mastery' : 'Advanced Commercial Workflows',
      milestone: 'Complete 3 real portfolio case studies and automated templates.',
    },
    {
      month: 'Month 2: First Paid Client Launch',
      focus: 'Outreach & Proposal Pitching (2 hrs/week)',
      milestone: `Land your first 1-2 paying clients or projects to hit ${targetIncome.split('–')[0].trim()}/month.`,
    },
    {
      month: 'Month 3: Scaling & Recurring Income',
      focus: 'Systematization & Long-term Retainers',
      milestone: `Consistent target achievement: ${targetIncome}/month secondary income.`,
    },
  ];

  return {
    trackNameEn,
    trackNameMl,
    trackTaglineEn,
    trackTaglineMl,
    readinessScore,
    projectedEarnings: `${targetIncome} / month`,
    monthlyTargetTimeframe: '30 – 45 Days',
    primaryMonetizationPath: 'AI Freelancing & Smart Automation',
    recommendedModules: modules,
    threeMonthRoadmap,
    voucherCode: readyToInvest ? 'AIMONEY80' : 'AIMONEY50',
    voucherDiscount: readyToInvest ? '80% OFF Early Bird Scholarship' : '50% OFF Limited Time Concession',
  };
}
