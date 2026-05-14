/**
 * Representa una inscripción dentro del sistema académico.
 *
 * Una inscripción almacena la relación entre un estudiante
 * y una asignatura, incluyendo información del estado del
 * proceso de matrícula y la fecha en que fue registrada.
 *
 * Esta interfaz es utilizada para gestionar el proceso de
 * inscripción de estudiantes a las asignaturas disponibles
 * dentro del sistema.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export interface Inscripcion {

  /**
   * Identificador único de la inscripción.
   */
  id: string;

  /**
   * Identificador del estudiante asociado
   * a la inscripción.
   */
  studentId: string;

  /**
   * Código de la asignatura en la que
   * el estudiante se inscribe.
   */
  subjectCode: string;

  /**
   * Fecha en la que se realizó la inscripción.
   */
  date: string;

  /**
   * Estado actual de la inscripción dentro
   * del sistema académico.
   */
  status: EstadoInscripcion;
}
