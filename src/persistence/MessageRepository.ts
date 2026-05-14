/**
 * Representa el repositorio encargado de gestionar
 * las operaciones relacionadas con los mensajes
 * de soporte dentro del sistema académico.
 *
 * Esta clase permite consultar los mensajes enviados,
 * registrar nuevos mensajes de soporte y marcar
 * conversaciones como leídas mediante peticiones
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
export class MessageRepository {

  /**
   * Obtiene todos los mensajes de soporte
   * registrados en el sistema.
   *
   * @returns {Promise<MensajeSoporte[]>} Promesa que retorna
   * un arreglo con todos los mensajes de soporte disponibles.
   */
  static async getAll(): Promise<MensajeSoporte[]> {
    const response = await fetch('/api/messages');
    return response.json();
  }

  /**
   * Envía un nuevo mensaje de soporte al sistema
   * mediante una petición HTTP de tipo POST.
   *
   * @param {Partial<MensajeSoporte>} message Información
   * parcial del mensaje de soporte que será enviada.
   *
   * @returns {Promise<MensajeSoporte>} Promesa que retorna
   * el mensaje de soporte registrado en el sistema.
   */
  static async sendMessage(message: Partial<MensajeSoporte>): Promise<MensajeSoporte> {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    return response.json();
  }

  /**
   * Marca como leídos los mensajes asociados
   * a un remitente específico dentro del sistema.
   *
   * @param {string} senderId Identificador del remitente
   * cuyos mensajes serán marcados como leídos.
   *
   * @returns {Promise<void>} Promesa que indica la finalización
   * del proceso de actualización de estado.
   */
  static async markAsRead(senderId: string): Promise<void> {
    await fetch('/api/messages/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId })
    });
  }
}
