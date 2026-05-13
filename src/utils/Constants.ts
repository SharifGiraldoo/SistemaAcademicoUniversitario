import { EstadoEstudiante } from '../models/enums/EstadoEstudiante';

export const RN_001_MESSAGE = "RN-001 VIOLADA: Estudiante NO ACTIVO. Matrícula bloqueada.";
export const RN_002_MESSAGE = "RN-002 VIOLADA: Asignatura sin cupos disponibles.";
export const RN_004_MESSAGE = "RN-004 VIOLADA: Límite de créditos excedido.";
export const RN_007_MESSAGE = "RN-007 VIOLADA: No puedes inscribir materias de semestres tan avanzados sin aprobar los niveles anteriores.";
export const SCHEDULE_CONFLICT_MESSAGE = "CONFLICTO DE HORARIO: Ya tienes una asignatura en este bloque.";
export const PREREQUISITE_MESSAGE = "PRERREQUISITO FALTANTE: No has aprobado los requisitos para esta materia.";
export const ALREADY_APPROVED_MESSAGE = "MATERIA APROBADA: Esta materia ya consta en tu historial como aprobada.";
export const OUT_OF_PERIOD_MESSAGE = "PERIODO CERRADO: La operación no se puede realizar fuera del periodo de matrícula académica.";
