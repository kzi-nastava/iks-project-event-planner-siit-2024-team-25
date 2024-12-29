import { NotificationCategory } from '../../../notification/model/notification-category.model';

export interface Notification {
  id?: number;
  title?: string;
  message?: string;
  isViewed?: boolean;
  entityId?: number;
  notificationCategory?: NotificationCategory;
}
