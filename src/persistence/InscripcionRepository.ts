import { Inscripcion } from '../models/Inscripcion';

export class InscripcionRepository {
  static async getAll(): Promise<Inscripcion[]> {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data.enrollments;
  }

  static async save(inscripcion: Inscripcion): Promise<boolean> {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollment: inscripcion })
    });
    return res.ok;
  }

  static async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/enroll/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  static async update(id: string, inscripcion: Inscripcion): Promise<boolean> {
    const res = await fetch(`/api/enroll/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollment: inscripcion })
    });
    return res.ok;
  }
}
