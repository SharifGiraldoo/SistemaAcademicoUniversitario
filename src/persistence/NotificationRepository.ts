/**
 * Representa el repositorio encargado de gestionar
 * las operaciones relacionadas con las notificaciones
 * dentro del sistema académico.
 *
 * Esta clase permite consultar las notificaciones
 * registradas, enviar nuevas notificaciones y actualizar
 * el estado de lectura de las mismas mediante peticiones
 * HTTP hacia la API correspondiente.
 *
 * Su implementación utiliza métodos estáticos para
 * centralizar la comunicación con los servicios
 * de persistencia del sistema.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export class NotificationRepository {

  /**
   * Obtiene todas las notificaciones registradas
   * en el sistema académico.
   *
   * @returns {Promise<Notificacion[]>} Promesa que retorna
   * un arreglo con todas las notificaciones disponibles.
   */
  static async getAll(): Promise<Notificacion[]> {
    const response = await fetch('/api/notifications');
    return response.json();
  }

  /**
   * Envía una nueva notificación al sistema
   * mediante una petición HTTP de tipo POST.
   *
   * @param {Partial<Notificacion>} notification Información
   * parcial de la notificación que será enviada.
   *
   * @returns {Promise<Notificacion>} Promesa que retorna
   * la notificación registrada en el sistema.
   */
  static async push(notification: Partial<Notificacion>): Promise<Notificacion> {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    });
    return response.json();
  }

  /**
   * Marca como leída una notificación específica
   * o todas las notificaciones asociadas a un estudiante.
   *
   * @param {string} [id] Identificador opcional
   * de la notificación que será marcada como leída.
   *
   * @param {string} [studentId] Identificador opcional
   * del estudiante cuyas notificaciones serán actualizadas.
   *
   * @returns {Promise<void>} Promesa que indica
   * la finalización del proceso de actualización.
   */
  static async markAsRead(id?: string, studentId?: string): Promise<void> {
    await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, studentId })
    });
  }
}
