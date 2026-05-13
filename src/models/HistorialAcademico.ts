import { EstadoInscripcion } from './enums/EstadoInscripcion';

export interface HistorialAcademico {
  id: string;
  studentId: string;
  subjectCode: string;
  grade: number;
  semester: number;
  date: string;
  status: EstadoInscripcion.COMPLETED | EstadoInscripcion.FAILED;
}
