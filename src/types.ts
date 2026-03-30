export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: 'work' | 'personal' | 'health' | 'other';
  createdAt: number;
}

export interface Suggestion {
  title: string;
  description: string;
  reason: string;
  category: Todo['category'];
}

export interface PlannerState {
  todos: Todo[];
  suggestions: Suggestion[];
  isGenerating: boolean;
}
