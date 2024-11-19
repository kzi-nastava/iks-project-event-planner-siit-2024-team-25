export interface HomeEvent{
    id: number;
    name: string;
    organizerName: string;
    description: string;
    date: Date;
    country: string;
    city: string;
    isLiked: boolean;
}