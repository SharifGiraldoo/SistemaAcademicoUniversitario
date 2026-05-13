import { Asignatura } from '../model/Asignatura';
import { HistorialAcademico } from '../model/HistorialAcademico';
import { EstadoInscripcion } from '../model/enums/EstadoInscripcion';

export class AsignaturaService {
  static hasPrerequisites(asignatura: Asignatura, history: HistorialAcademico[]): { met: boolean, missing: string[] } {
    if (!asignatura.prerequisites || asignatura.prerequisites.length === 0) {
      return { met: true, missing: [] };
    }

    const missing = asignatura.prerequisites.filter(pre => 
      !history.some(h => h.subjectCode === pre && h.status === EstadoInscripcion.COMPLETED)
    );

    return { met: missing.length === 0, missing };
  }

  static hasCapacity(asignatura: Asignatura): boolean {
    return asignatura.enrolledCount < asignatura.capacity;
  }
}
