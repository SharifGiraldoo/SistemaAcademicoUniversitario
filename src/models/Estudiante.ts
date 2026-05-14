/**
 * Representa a un estudiante dentro del sistema académico.
 *
 * Un estudiante hereda la información básica de un usuario
 * y añade atributos específicos relacionados con su estado
 * académico, límite de créditos permitidos, información
 * visual de perfil y semestre actual.
 *
 * Esta interfaz define la estructura necesaria para gestionar
 * procesos académicos como inscripciones, validaciones y
 * seguimiento del progreso estudiantil.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export interface Estudiante extends Usuario {

  /**
   * Estado académico actual del estudiante
   * dentro del sistema.
   */
  status: EstadoEstudiante;

  /**
   * Cantidad máxima de créditos académicos
   * que el estudiante puede cursar.
   */
  maxCredits: number;

  /**
   * URL de la imagen de perfil del estudiante.
   *
   * Este atributo es opcional.
   */
  avatarUrl?: string;

  /**
   * Semestre académico actual del estudiante.
   *
   * Este atributo es opcional y puede utilizarse
   * para validaciones académicas adicionales.
   */
  semester?: number;
}
