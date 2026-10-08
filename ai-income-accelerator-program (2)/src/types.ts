export type Language = 'en' | 'ml';

export interface QuestionOption {
  id: string;
  labelEn: string;
  labelMl: string;
  descriptionEn?: string;
  descriptionMl?: string;
  badge?: string;
  iconName?: string;
}

export type QuestionType = 'single-choice' | 'text-input' | 'tel-input' | 'email-input' | 'salary-input';

export interface Question {
  id: keyof UserResponses;
  questionNumber: number;
  categoryEn: string;
  categoryMl: string;
  titleEn: string;
  titleMl: string;
  subtitleEn?: string;
  subtitleMl?: string;
  type: QuestionType;
  placeholderEn?: string;
  placeholderMl?: string;
  options?: QuestionOption[];
  allowCustomInput?: boolean;
  hintEn?: string;
  hintMl?: string;
}

export interface UserResponses {
  fullName?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  currentSalary?: string;
  salarySatisfied?: 'Yes' | 'No' | string;
  usingAiTools?: 'Yes' | 'No' | string;
  interestedInAiSkills?: 'Yes' | 'No' | string;
  targetAdditionalIncome?: string;
  willingToDedicateTime?: 'Yes' | 'No' | string;
  readyToPay?: 'Yes' | 'No' | string;
  willingToInvest?: string;
}

export interface RecommendedPlan {
  trackNameEn: string;
  trackNameMl: string;
  trackTaglineEn: string;
  trackTaglineMl: string;
  readinessScore: number;
  projectedEarnings: string;
  monthlyTargetTimeframe: string;
  primaryMonetizationPath: string;
  recommendedModules: {
    titleEn: string;
    titleMl: string;
    duration: string;
    description: string;
  }[];
  threeMonthRoadmap: {
    month: string;
    focus: string;
    milestone: string;
  }[];
  voucherCode: string;
  voucherDiscount: string;
}
