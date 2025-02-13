import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarEventsService } from '../../../core/services/calendar-event.service';

@Component({
  selector: 'app-calendario-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario-evento.component.html',
  styleUrls: ['./calendario-evento.component.css']
})
export class CalendarioEventoComponent implements OnInit {
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  currentMonth: Date = new Date();
  showMonthSelector: boolean = false;
  weekDays: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  months: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i - 5);
  calendarDays: Array<{
    date: Date;
    isCurrentMonth: boolean;
    hasEvents: boolean;
    isToday: boolean;
  }> = [];
  events: CalendarEvent[] = [];

  constructor(private calendarService: CalendarEventsService) { }

  ngOnInit() {
    this.generateCalendarDays();
    this.loadEvents();
  }

  generateCalendarDays() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    let firstDayIndex = firstDay.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        hasEvents: false,
        isToday: this.isToday(date)
      });
    }

    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      this.calendarDays.push({
        date: new Date(date),
        isCurrentMonth: true,
        hasEvents: false,
        isToday: this.isToday(date)
      });
    }

    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        hasEvents: false,
        isToday: this.isToday(date)
      });
    }
  }

  loadEvents() {
    this.calendarService.getEvents().subscribe(events => {
      this.events = events;
      this.updateCalendarEvents();
    });
  }

  updateCalendarEvents() {
    this.calendarDays = this.calendarDays.map(day => ({
      ...day,
      hasEvents: this.events.some(event =>
        event.date.getDate() === day.date.getDate() &&
        event.date.getMonth() === day.date.getMonth() &&
        event.date.getFullYear() === day.date.getFullYear()
      )
    }));
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  toggleMonthSelector() {
    this.showMonthSelector = !this.showMonthSelector;
  }

  selectMonth(monthIndex: number) {
    this.currentMonth.setMonth(monthIndex);
    this.generateCalendarDays();
    this.showMonthSelector = false;
  }

  selectYear(year: number) {
    this.currentMonth.setFullYear(year);
    this.generateCalendarDays();
    this.showMonthSelector = false;
  }

  navigateMonth(direction: number) {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
    this.generateCalendarDays();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.calendarService.getEventsByDate(date).subscribe(events => {
      this.events = events;
    });
  }
}