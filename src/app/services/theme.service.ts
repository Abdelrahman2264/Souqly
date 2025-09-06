import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'souqlyTheme';
  private themeChangedSubject = new BehaviorSubject<string>(this.getCurrentTheme());

  constructor() {
    const saved = localStorage.getItem(this.key) || 'light';
    this.apply(saved as 'light' | 'dark');
  }

  toggle() {
    const current = this.getCurrentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.apply(next as 'light' | 'dark');
    this.themeChangedSubject.next(next);
  }

  apply(mode: 'light' | 'dark') {
    const body = document.body;
    if (mode === 'dark') {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
    localStorage.setItem(this.key, mode);
  }

  getCurrentTheme(): string {
    return localStorage.getItem(this.key) || 'light';
  }

  isDarkTheme(): boolean {
    return this.getCurrentTheme() === 'dark';
  }

  get themeChanged(): Observable<string> {
    return this.themeChangedSubject.asObservable();
  }
}