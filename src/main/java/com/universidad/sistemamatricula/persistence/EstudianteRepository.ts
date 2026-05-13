import { Estudiante } from '../model/Estudiante';

export class EstudianteRepository {
  static async getAll(): Promise<Estudiante[]> {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data.students;
  }
}
