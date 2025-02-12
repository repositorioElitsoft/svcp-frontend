
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
}

@Injectable({
    providedIn: 'root'
})
export class CalendarEventsService {
    private events: CalendarEvent[] = [
        {
            id: '1',
            title: 'OT 404 - Mantenimiento',
            date: new Date(2025, 1, 9)
        },
        {
            id: '2',
            title: 'OT 405 - Revisión',
            date: new Date(2025, 1, 9)
        },
        {
            id: '3',
            title: 'OT 406 - Reemplazo de piezas',
            date: new Date(2025, 1, 9)
        },
        {
            id: '4',
            title: 'OT 407 - Ajuste',
            date: new Date(2025, 1, 9)
        },
        {
            id: '5',
            title: 'OT 408 - Inspección',
            date: new Date(2025, 1, 9)
        },
        {
            id: '6',
            title: 'OT 404 - Mantenimiento',
            date: new Date(2025, 1, 10)
        },
        {
            id: '7',
            title: 'OT 405 - Revisión',
            date: new Date(2025, 1, 10)
        },
        {
            id: '8',
            title: 'OT 406 - Reemplazo de piezas',
            date: new Date(2025, 1, 10)
        },
        {
            id: '9',
            title: 'OT 407 - Ajuste',
            date: new Date(2025, 1, 10)
        },
        {
            id: '10',
            title: 'OT 408 - Inspección',
            date: new Date(2025, 1, 10)
        },
        {
            id: '11',
            title: 'OT 404 - Mantenimiento',
            date: new Date(2025, 1, 17)
        },
        {
            id: '12',
            title: 'OT 405 - Revisión',
            date: new Date(2025, 1, 17)
        },
        {
            id: '13',
            title: 'OT 406 - Reemplazo de piezas',
            date: new Date(2025, 1, 17)
        },
        {
            id: '14',
            title: 'OT 407 - Ajuste',
            date: new Date(2025, 1, 17)
        },
        {
            id: '15',
            title: 'OT 408 - Inspección',
            date: new Date(2025, 1, 17)
        },
        {
            id: '16',
            title: 'OT 404 - Mantenimiento',
            date: new Date(2025, 1, 18)
        },
        {
            id: '17',
            title: 'OT 405 - Revisión',
            date: new Date(2025, 1, 18)
        },
        {
            id: '18',
            title: 'OT 406 - Reemplazo de piezas',
            date: new Date(2025, 1, 18)
        },
        {
            id: '19',
            title: 'OT 407 - Ajuste',
            date: new Date(2025, 1, 18)
        },
        {
            id: '20',
            title: 'OT 408 - Inspección',
            date: new Date(2025, 1, 18)
        }
    ];

    getEvents(): Observable<CalendarEvent[]> {
        return of(this.events);
    }

    getEventsByDate(date: Date): Observable<CalendarEvent[]> {
        return of(this.events.filter(event =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear()
        ));
    }
}