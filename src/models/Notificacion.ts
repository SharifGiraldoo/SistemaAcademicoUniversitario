/**
 * Define los tipos de notificación disponibles dentro del sistema académico.
 *
 * Estas categorías permiten clasificar las notificaciones según su naturaleza,
 * como recordatorios, información general, fechas límite o publicación de notas.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export enum TipoNotificacion {

  /**
   * Notificación relacionada con fechas límite
   * (entregas, inscripciones o eventos académicos).
   */
  DEADLINE = 'DEADLINE',

  /**
   * Notificación relacionada con calificaciones
   * o resultados académicos.
   */
  GRADE = 'GRADE',

  /**
   * Notificación informativa general del sistema.
   */
  INFO = 'INFO',

  /**
   * Notificación de tipo recordatorio
   * para actividades o eventos próximos.
   */
  REMINDER = 'REMINDER'
}

/**
 * Representa una notificación dentro del sistema académico.
 *
 * Las notificaciones permiten informar a los estudiantes
 * sobre eventos importantes, cambios académicos, recordatorios
 * o resultados relevantes dentro del sistema.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export interface Notificacion {

  /**
   * Identificador único de la notificación.
   */
  id: string;

  /**
   * Identificador del estudiante destinatario.
   * Puede ser "ALL" para notificaciones globales.
   */
  studentId: string;

  /**
   * Título de la notificación.
   */
  title: string;

  /**
   * Contenido detallado de la notificación.
   */
  content: string;

  /**
   * Tipo de notificación según su categoría.
   */
  type: TipoNotificacion;

  /**
   * Fecha de creación o envío de la notificación.
   */
  date: string;

  /**
   * Indica si la notificación ha sido leída.
   */
  read: boolean;
}
