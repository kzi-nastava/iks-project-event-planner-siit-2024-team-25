export interface CalendarEvent {
  title: string;
  startDate: string;
  endDate: string;
  eventType: CalendarEventType;
}

export type CalendarEventType = 'EVENT' | 'MY_EVENT' | 'RESERVATION';
