/**
 * Representa un usuario dentro del sistema académico.
 *
 * Un usuario es la entidad base del sistema y contiene la
 * información común necesaria para la autenticación y
 * gestión de roles dentro de la plataforma.
 *
 * Esta interfaz sirve como base para otros tipos de usuario
 * como estudiantes o administradores.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export interface Usuario {

  /**
   * Identificador único del usuario dentro del sistema.
   */
  id: string;

  /**
   * Nombre completo del usuario.
   */
  name: string;

  /**
   * Correo electrónico del usuario.
   */
  email: string;

  /**
   * Contraseña del usuario para autenticación.
   *
   * Este atributo es opcional por razones de seguridad
   * y manejo de sesiones.
   */
  password?: string;

  /**
   * Rol del usuario dentro del sistema.
   * Puede ser estudiante o administrador.
   */
  role?: 'student' | 'admin';
}
