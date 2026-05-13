import { Usuario } from './Usuario';
import { EstadoEstudiante } from './enums/EstadoEstudiante';

export interface Estudiante extends Usuario {
  status: EstadoEstudiante;
  maxCredits: number;
  avatarUrl?: string;
  semester?: number; // Added for the new validation
}
