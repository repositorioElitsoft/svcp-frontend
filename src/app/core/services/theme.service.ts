import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'indigo-pink' | 'deeppurple-amber' | 'pink-bluegrey' | 'purple-green';
export type Mode = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    mode: Mode;
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private state = new BehaviorSubject<ThemeState>({
        theme: 'indigo-pink',
        mode: 'light'
    });

    currentState$ = this.state.asObservable();

    constructor() {
        // Load saved preferences from localStorage
        const savedState = localStorage.getItem('themeState');
        if (savedState) {
            this.setState(JSON.parse(savedState));
        }

        // Check system preference for dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if (!savedState && prefersDark.matches) {
            this.setMode('dark');
        }

        // Listen for system theme changes
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('themeState')) {
                this.setMode(e.matches ? 'dark' : 'light');
            }
        });
    }

    private setState(state: ThemeState) {
        localStorage.setItem('themeState', JSON.stringify(state));
        this.state.next(state);
        console.log('Themestate:');
        console.log(state);
        this.updateBodyClasses(state);
    }

    setTheme(theme: Theme) {
        this.setState({ ...this.state.value, theme });
    }

    setMode(mode: Mode) {
        this.setState({ ...this.state.value, mode });
    }

    private updateBodyClasses({ theme, mode }: ThemeState) {
        // Remove all theme classes
        document.body.classList.remove(
            'indigo-pink-theme',
            'deeppurple-amber-theme',
            'pink-bluegrey-theme',
            'purple-green-theme',
            'light-mode',
            'dark-mode',
            "dark",
        );
        // Add new theme and mode classes
        if (mode === 'dark') { document.body.classList.add("dark"); }
        document.body.classList.add(`${mode === 'dark' ? 'purple-green' : 'deeppurple-amber'}-theme`, `${mode}-mode`);
    }
}