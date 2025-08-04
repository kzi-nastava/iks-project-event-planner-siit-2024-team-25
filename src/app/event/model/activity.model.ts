export interface Activity {
  id?: number;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}
