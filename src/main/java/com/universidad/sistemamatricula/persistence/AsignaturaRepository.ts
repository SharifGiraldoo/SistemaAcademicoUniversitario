import { Asignatura } from '../model/Asignatura';

export class AsignaturaRepository {
  static async getAll(): Promise<Asignatura[]> {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data.subjects;
  }
}
