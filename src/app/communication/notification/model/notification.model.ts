import { NotificationCategory } from './notification-category.model';

export interface Notification {
  id?: number;
  title?: string;
  message?: string;
  isViewed?: boolean;
  entityId?: number;
  notificationCategory?: NotificationCategory;
  createdDate?: Date;
}
