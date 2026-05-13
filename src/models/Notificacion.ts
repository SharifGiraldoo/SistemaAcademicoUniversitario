export enum TipoNotificacion {
  DEADLINE = 'DEADLINE',
  GRADE = 'GRADE',
  INFO = 'INFO',
  REMINDER = 'REMINDER'
}

export interface Notificacion {
  id: string;
  studentId: string; // 'ALL' for global
  title: string;
  content: string;
  type: TipoNotificacion;
  date: string;
  read: boolean;
}
