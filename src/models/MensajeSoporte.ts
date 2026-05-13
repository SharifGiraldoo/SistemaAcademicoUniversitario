export interface MensajeSoporte {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string; // "admin" or specific student ID
  content: string;
  timestamp: string;
  read: boolean;
}
