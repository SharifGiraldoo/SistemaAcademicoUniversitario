import { EstadoInscripcion } from './enums/EstadoInscripcion';

export interface Inscripcion {
  id: string;
  studentId: string;
  subjectCode: string;
  date: string;
  status: EstadoInscripcion;
}
