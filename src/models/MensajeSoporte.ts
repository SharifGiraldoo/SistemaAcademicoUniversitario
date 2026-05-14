/**
 * Representa un mensaje de soporte dentro del sistema académico.
 *
 * Un mensaje de soporte permite la comunicación entre estudiantes
 * y el personal administrativo (o administradores del sistema),
 * facilitando la resolución de dudas, solicitudes o incidencias.
 *
 * Esta interfaz define la estructura de los mensajes enviados
 * dentro del módulo de soporte, incluyendo información del emisor,
 * receptor, contenido, estado de lectura y fecha de envío.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export interface MensajeSoporte {

  /**
   * Identificador único del mensaje de soporte.
   */
  id: string;

  /**
   * Identificador del remitente del mensaje.
   */
  senderId: string;

  /**
   * Nombre del remitente del mensaje.
   */
  senderName: string;

  /**
   * Identificador del destinatario del mensaje.
   * Puede ser "admin" o el ID de un estudiante específico.
   */
  receiverId: string;

  /**
   * Contenido del mensaje enviado.
   */
  content: string;

  /**
   * Fecha y hora en la que se envió el mensaje.
   */
  timestamp: string;

  /**
   * Indica si el mensaje ha sido leído.
   */
  read: boolean;
}
