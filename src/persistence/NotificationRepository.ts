import { Notificacion } from '../models/Notificacion';

export class NotificationRepository {
  static async getAll(): Promise<Notificacion[]> {
    const response = await fetch('/api/notifications');
    return response.json();
  }

  static async push(notification: Partial<Notificacion>): Promise<Notificacion> {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    });
    return response.json();
  }

  static async markAsRead(id?: string, studentId?: string): Promise<void> {
    await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, studentId })
    });
  }
}
