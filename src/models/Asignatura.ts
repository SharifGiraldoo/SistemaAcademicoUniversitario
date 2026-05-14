/**
 * Representa una asignatura dentro del sistema académico.
 *
 * Una asignatura permite organizar y gestionar la información
 * relacionada con las materias ofrecidas, incluyendo datos
 * como código, créditos, semestre, capacidad disponible,
 * horario y prerrequisitos requeridos.
 *
 * Esta interfaz define la estructura esencial necesaria
 * para administrar el proceso de inscripción y control
 * académico de los estudiantes.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export interface Asignatura {

  /**
   * Identificador único de la asignatura.
   */
  id: string;

  /**
   * Código institucional de la asignatura.
   */
  code: string;

  /**
   * Nombre de la asignatura.
   */
  name: string;

  /**
   * Cantidad de créditos académicos
   * asignados a la materia.
   */
  credits: number;

  /**
   * Semestre académico al que
   * pertenece la asignatura.
   */
  semester: number;

  /**
   * Capacidad máxima de estudiantes
   * permitidos en la asignatura.
   */
  capacity: number;

  /**
   * Cantidad actual de estudiantes
   * inscritos en la asignatura.
   */
  enrolledCount: number;

  /**
   * Horario asignado para el desarrollo
   * de la asignatura.
   */
  schedule: string;

  /**
   * Lista de identificadores de asignaturas
   * requeridas como prerrequisitos.
   */
  prerequisites: string[];

  /**
   * Descripción general de la asignatura.
   *
   * Este atributo es opcional.
   */
  description?: string;
}
