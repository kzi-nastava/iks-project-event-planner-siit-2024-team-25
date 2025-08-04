export interface ReviewStats {
  reviewCount: number;
  averageRating: number;
  reviewCounts: {
    [key: number]: number;
  };
}
