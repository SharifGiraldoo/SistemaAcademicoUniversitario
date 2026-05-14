/**
 * Representa el gestor encargado de administrar la persistencia
 * de datos del sistema académico mediante el consumo de endpoints
 * asociados a archivos CSV en el servidor.
 *
 * Esta clase permite obtener información general del sistema,
 * registrar nuevas inscripciones y eliminar inscripciones existentes
 * utilizando peticiones HTTP hacia la API.
 *
 * Su implementación está basada en métodos estáticos para facilitar
 * el acceso centralizado a las operaciones de persistencia.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export class CsvManager {

  /**
   * Obtiene toda la información almacenada en los archivos CSV
   * mediante una petición al endpoint principal de datos.
   *
   * @returns {Promise<any>} Promesa que retorna los datos
   * completos recuperados desde el servidor.
   *
   * @throws {Error} Lanza una excepción si ocurre un error
   * durante la carga de los archivos CSV.
   */
  static async fetchAllData() {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error("Error cargando CSVs");
    return await res.json();
  }

  /**
   * Registra una nueva inscripción en el sistema académico
   * mediante una petición HTTP de tipo POST.
   *
   * @param {Inscripcion} inscripcion Inscripción que será
   * enviada y almacenada en el servidor.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si la operación fue exitosa o false en caso contrario.
   */
  static async registerInscripcion(inscripcion: Inscripcion) {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollment: inscripcion })
    });
    return res.ok;
  }

  /**
   * Elimina una inscripción existente del sistema académico
   * utilizando el identificador único de la inscripción.
   *
   * @param {string} id Identificador de la inscripción
   * que será eliminada.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si la eliminación fue exitosa o false en caso contrario.
   */
  static async removeInscripcion(id: string) {
    const res = await fetch(`/api/enroll/${id}`, { method: 'DELETE' });
    return res.ok;
  }
}
