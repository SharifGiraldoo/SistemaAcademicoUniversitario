import { Estudiante } from '../models/Estudiante';

export class EstudianteRepository {
  static async getAll(): Promise<Estudiante[]> {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data.students;
  }

  static async createAsAdmin(student: Partial<Estudiante>): Promise<boolean> {
    const res = await fetch('/api/admin/create-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student })
    });
    return res.ok;
  }
}
