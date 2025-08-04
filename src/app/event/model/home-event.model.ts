export interface HomeEvent {
  id: number;
  name: string;
  organizerFirstName: string;
  organizerLastName: string;
  description: string;
  startDateTime: string;
  country: string;
  city: string;
  isFavorite: boolean;
}
