/**
 * Representa el repositorio encargado de gestionar el acceso
 * y la obtención de información relacionada con las asignaturas
 * dentro del sistema académico.
 *
 * Esta clase centraliza las operaciones de consulta hacia la API,
 * permitiendo recuperar la lista de asignaturas registradas.
 *
 * Su implementación utiliza métodos estáticos para facilitar
 * el acceso a los datos sin necesidad de instanciar la clase.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export class AsignaturaRepository {

  /**
   * Obtiene todas las asignaturas registradas en el sistema
   * mediante una petición a la API correspondiente.
   *
   * @returns {Promise<Asignatura[]>} Promesa que retorna
   * un arreglo con todas las asignaturas disponibles.
   */
  static async getAll(): Promise<Asignatura[]> {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data.subjects;
  }
}
