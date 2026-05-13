export interface Usuario {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: 'student' | 'admin';
}
