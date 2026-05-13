import { Estudiante } from "../models/Estudiante";

export class StudentRepository {
  static async update(id: string, student: Partial<Estudiante>): Promise<boolean> {
    try {
      const res = await fetch(`/api/student/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student })
      });
      return res.ok;
    } catch (err) {
      console.error("Error updating student:", err);
      return false;
    }
  }

  static async create(student: Estudiante): Promise<boolean> {
    try {
      const res = await fetch(`/api/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student })
      });
      return res.ok;
    } catch (err) {
      console.error("Error creating student:", err);
      return false;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/student/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error("Error deleting student:", err);
      return false;
    }
  }
}
