/**
 * Representa el repositorio encargado de gestionar
 * las operaciones relacionadas con las inscripciones
 * dentro del sistema académico.
 *
 * Esta clase permite consultar, registrar, actualizar
 * y eliminar inscripciones mediante peticiones HTTP
 * hacia los endpoints correspondientes de la API.
 *
 * Su implementación utiliza métodos estáticos para
 * centralizar el acceso a las funcionalidades de
 * persistencia de las inscripciones.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export class InscripcionRepository {

  /**
   * Obtiene todas las inscripciones registradas
   * en el sistema académico mediante una petición
   * al endpoint de datos.
   *
   * @returns {Promise<Inscripcion[]>} Promesa que retorna
   * un arreglo con todas las inscripciones disponibles.
   */
  static async getAll(): Promise<Inscripcion[]> {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data.enrollments;
  }

  /**
   * Registra una nueva inscripción en el sistema
   * mediante una petición HTTP de tipo POST.
   *
   * @param {Inscripcion} inscripcion Inscripción
   * que será almacenada en el sistema.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si el registro fue exitoso o false en caso contrario.
   */
  static async save(inscripcion: Inscripcion): Promise<boolean> {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollment: inscripcion })
    });
    return res.ok;
  }

  /**
   * Elimina una inscripción existente del sistema
   * utilizando su identificador único.
   *
   * @param {string} id Identificador de la inscripción
   * que será eliminada.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si la eliminación fue exitosa o false en caso contrario.
   */
  static async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/enroll/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  /**
   * Actualiza la información de una inscripción
   * existente dentro del sistema académico.
   *
   * @param {string} id Identificador de la inscripción
   * que será actualizada.
   *
   * @param {Inscripcion} inscripcion Nueva información
   * de la inscripción que será enviada al servidor.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si la actualización fue exitosa o false en caso contrario.
   */
  static async update(id: string, inscripcion: Inscripcion): Promise<boolean> {
    const res = await fetch(`/api/enroll/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollment: inscripcion })
    });
    return res.ok;
  }
}
