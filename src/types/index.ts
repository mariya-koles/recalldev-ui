export interface Question {
  id: number;
  questionText: string;
  questionAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  questions?: Question[];
}

export interface CreateQuestionRequest {
  questionText: string;
  questionAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateQuestionRequest {
  questionText: string;
  questionAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface SearchParams {
  keyword?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  tagNames?: string[];
  includeTags?: boolean;
}

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export const DIFFICULTY_COLORS = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-red-100 text-red-800',
} as const; 