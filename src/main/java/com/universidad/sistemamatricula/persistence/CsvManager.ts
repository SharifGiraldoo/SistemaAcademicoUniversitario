import { Asignatura } from '../model/Asignatura';
import { Estudiante } from '../model/Estudiante';
import { Inscripcion } from '../model/Inscripcion';
import { HistorialAcademico } from '../model/HistorialAcademico';

/**
 * Persistencia en el cliente mediante Fetch a los Endpoints del Servidor CSV
 */
export class CsvManager {
  static async fetchAllData() {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error("Error cargando CSVs");
    return await res.json();
  }

  static async registerInscripcion(inscripcion: Inscripcion) {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollment: inscripcion })
    });
    return res.ok;
  }

  static async removeInscripcion(id: string) {
    const res = await fetch(`/api/enroll/${id}`, { method: 'DELETE' });
    return res.ok;
  }
}
