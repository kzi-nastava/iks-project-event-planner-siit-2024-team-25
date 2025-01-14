export interface Review {
  id: number;
  comment: string;
  rating: number;
  status: number;
  user: { id: number; firstName: string; lastName: string };
  event: { id: number; name: string };
  offering: { id: number; name: string };
  createdDate: Date;
}
