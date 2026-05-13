import { Estudiante } from '../models/Estudiante';
import { Asignatura } from '../models/Asignatura';
import { Inscripcion } from '../models/Inscripcion';
import { HistorialAcademico } from '../models/HistorialAcademico';
import { EstadoEstudiante } from '../models/enums/EstadoEstudiante';
import { EstadoInscripcion } from '../models/enums/EstadoInscripcion';
import * as Constants from '../utils/Constants';

export class InscripcionService {
  static validate(
    estudiante: Estudiante, 
    asignatura: Asignatura, 
    inscripcionesActuales: Inscripcion[], 
    historial: HistorialAcademico[],
    totalAsignaturas: Asignatura[]
  ): string | null {
    
    // RN-001: Estado activo
    if (estudiante.status !== EstadoEstudiante.ACTIVE) {
      return Constants.RN_001_MESSAGE;
    }

    // RN-002: Cupos
    if (asignatura.enrolledCount >= asignatura.capacity) {
      return Constants.RN_002_MESSAGE;
    }

    // Ya inscrita
    if (inscripcionesActuales.some(e => e.subjectCode === asignatura.code)) {
      return "Ya inscrito en esta asignatura.";
    }

    // Ya aprobada
    if (historial.some(h => h.subjectCode === asignatura.code && h.status === EstadoInscripcion.COMPLETED)) {
      return Constants.ALREADY_APPROVED_MESSAGE;
    }

    // RN-007: Semestre superior (Solo hasta el semestre actual del estudiante)
    if (estudiante.semester && asignatura.semester > estudiante.semester) {
       return "No puedes inscribir materias de semestres superiores al actual.";
    }

    // Prerrequisitos
    for (const pre of asignatura.prerequisites) {
      if (pre && !historial.some(h => h.subjectCode === pre && h.status === EstadoInscripcion.COMPLETED)) {
        return `${Constants.PREREQUISITE_MESSAGE} (Falta: ${pre})`;
      }
    }

    // RN-004: Créditos
    const currentCredits = inscripcionesActuales.reduce((sum, e) => {
      const s = totalAsignaturas.find(sub => sub.code === e.subjectCode);
      return sum + (s?.credits || 0);
    }, 0);
    if (currentCredits + asignatura.credits > estudiante.maxCredits) {
      return Constants.RN_004_MESSAGE;
    }

    // Horarios
    const schedules = inscripcionesActuales.map(e => totalAsignaturas.find(sub => sub.code === e.subjectCode)?.schedule);
    if (schedules.includes(asignatura.schedule)) {
      return Constants.SCHEDULE_CONFLICT_MESSAGE;
    }

    return null;
  }
}
