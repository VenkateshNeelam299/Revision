import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, map } from 'rxjs';

export interface QAItem {
  question: string;
  answer: {
    text: string;
    points: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private readonly STORAGE_KEY = 'local_questions';
  private questionsSubject = new BehaviorSubject<QAItem[]>([]);
  questions$ = this.questionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadQuestions();
  }

  private hasLocalStorage(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch (e) {
      return false;
    }
  }

  private loadQuestions() {
    // Load questions from both sources and combine them
    const localQuestions = this.getLocalQuestions();
    
    this.http.get<{ items: QAItem[] }>('assets/data.json').subscribe({
      next: (res) => {
        const allQuestions = [...(res.items || []), ...localQuestions];
        this.questionsSubject.next(allQuestions);
      },
      error: () => {
        // If JSON fails to load, still show local questions
        this.questionsSubject.next(localQuestions);
      }
    });
  }

  private getLocalQuestions(): QAItem[] {
    if (!this.hasLocalStorage()) return [];

    try {
      const stored = window.localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Unable to read localQuestions from localStorage', e);
      return [];
    }
  }

  addQuestion(question: QAItem) {
    // Persist to localStorage when available
    if (this.hasLocalStorage()) {
      try {
        const current = this.getLocalQuestions();
        const updated = [...current, question];
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Unable to save question to localStorage', e);
      }
    }

    // Update the in-memory list for the app
    const allQuestions = [...this.questionsSubject.value, question];
    this.questionsSubject.next(allQuestions);
  }

  exportQuestions(): void {
    const data = JSON.stringify({ items: this.questionsSubject.value }, null, 2);
    // Only attempt client-side download when running in a browser
    if (typeof window === 'undefined') {
      console.warn('Export not available: not running in a browser environment');
      return;
    }

    try {
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'updated_questions.json';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Failed to export questions', e);
    }
  }
}