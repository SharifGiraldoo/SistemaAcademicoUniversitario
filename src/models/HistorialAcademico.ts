/**
 * Representa el historial académico de un estudiante
 * dentro del sistema académico.
 *
 * Un historial académico almacena la información relacionada
 * con las asignaturas cursadas por un estudiante, incluyendo
 * calificaciones obtenidas, semestre cursado, fecha de registro
 * y estado final de aprobación o pérdida.
 *
 * Esta interfaz permite llevar el control y seguimiento
 * del desempeño académico de los estudiantes.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export interface HistorialAcademico {

  /**
   * Identificador único del registro académico.
   */
  id: string;

  /**
   * Identificador del estudiante asociado
   * al historial académico.
   */
  studentId: string;

  /**
   * Código de la asignatura cursada
   * por el estudiante.
   */
  subjectCode: string;

  /**
   * Calificación obtenida por el estudiante
   * en la asignatura.
   */
  grade: number;

  /**
   * Semestre académico en el que fue
   * cursada la asignatura.
   */
  semester: number;

  /**
   * Fecha de registro del resultado académico.
   */
  date: string;

  /**
   * Estado final de la asignatura cursada,
   * indicando si fue aprobada o perdida.
   */
  status: EstadoInscripcion.COMPLETED | EstadoInscripcion.FAILED;
}
