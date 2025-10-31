// Survey related types
export interface Category {
  code: string;
  title: string;
  tempId: number;
}

export interface Question {
  code: string;
  categoryCode: string;
  text: string;
  answerType: AnswerType;
  ratingScale: number[];
  ratingScaleLabels?: {
    minLabel: string;
    maxLabel: string;
    hasNAOption?: boolean;
  };
  options: string[];
  showIf: string | null;
  specificToKP: string[];
  tempId: number;
}

export interface SurveyData {
  _id?: string;
  title: string;
  country: any;
  categories: Category[];
  questions: Question[];
  isActive: boolean;
}

export type AnswerType = 'Rating' | 'YesNo' | 'MCQ' | 'Text';
export type StepId = 'basic' | 'categories' | 'questions' | 'review';

export interface Step {
  id: StepId;
  name: string;
}

// Constants
export const ANSWER_TYPES: AnswerType[] = ['Rating', 'YesNo', 'MCQ', 'Text'];

export const KEY_POPULATIONS = [
  'Sex Worker',
  'People Who Use Drugs', 
  'Transgender Community',
  'People Living With HIV',
  'Intersex'
] as const;