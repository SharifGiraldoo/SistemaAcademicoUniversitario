import { Estudiante } from '../models/Estudiante';
import { EstadoEstudiante } from '../models/enums/EstadoEstudiante';

export class EstudianteService {
  static isActivo(estudiante: Estudiante): boolean {
    return estudiante.status === EstadoEstudiante.ACTIVE;
  }

  static hasCreditsAvailable(estudiante: Estudiante, currentCredits: number, subjectCredits: number): boolean {
    return (currentCredits + subjectCredits) <= estudiante.maxCredits;
  }
}
