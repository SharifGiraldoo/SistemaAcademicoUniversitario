import { EstadoInscripcion } from './enums/EstadoInscripcion';

export interface HistorialAcademico {
  studentId: string;
  subjectCode: string;
  grade: number;
  status: EstadoInscripcion;
}
