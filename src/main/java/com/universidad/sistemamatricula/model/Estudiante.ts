import { Usuario } from './Usuario';
import { EstadoEstudiante } from './enums/EstadoEstudiante';

export interface Estudiante extends Usuario {
  status: EstadoEstudiante;
  maxCredits: number;
  semester?: number;
  avatarUrl?: string;
}
