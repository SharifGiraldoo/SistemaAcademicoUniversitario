import { Estudiante } from '../model/Estudiante';
import { EstadoEstudiante } from '../model/enums/EstadoEstudiante';

export class EstudianteService {
  static isActivo(estudiante: Estudiante): boolean {
    return estudiante.status === EstadoEstudiante.ACTIVE;
  }

  static hasCreditsAvailable(estudiante: Estudiante, currentCredits: number, subjectCredits: number): boolean {
    return (currentCredits + subjectCredits) <= estudiante.maxCredits;
  }
}
