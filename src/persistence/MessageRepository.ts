import { MensajeSoporte } from '../models/MensajeSoporte';

export class MessageRepository {
  static async getAll(): Promise<MensajeSoporte[]> {
    const response = await fetch('/api/messages');
    return response.json();
  }

  static async sendMessage(message: Partial<MensajeSoporte>): Promise<MensajeSoporte> {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    return response.json();
  }

  static async markAsRead(senderId: string): Promise<void> {
    await fetch('/api/messages/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId })
    });
  }
}
