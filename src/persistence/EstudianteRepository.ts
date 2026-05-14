/**
 * Representa el repositorio encargado de gestionar
 * las operaciones relacionadas con los estudiantes
 * dentro del sistema académico.
 *
 * Esta clase permite consultar la información de los
 * estudiantes registrados y crear nuevos estudiantes
 * mediante funcionalidades administrativas.
 *
 * Su implementación utiliza métodos estáticos para
 * facilitar el acceso centralizado a los servicios
 * de persistencia y comunicación con la API.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export class EstudianteRepository {

  /**
   * Obtiene todos los estudiantes registrados
   * en el sistema académico mediante una petición
   * al endpoint de datos.
   *
   * @returns {Promise<Estudiante[]>} Promesa que retorna
   * un arreglo con todos los estudiantes disponibles.
   */
  static async getAll(): Promise<Estudiante[]> {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data.students;
  }

  /**
   * Crea un nuevo estudiante desde el módulo administrativo
   * del sistema mediante una petición HTTP de tipo POST.
   *
   * @param {Partial<Estudiante>} student Información parcial
   * del estudiante que será registrada en el sistema.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si el registro fue exitoso o false en caso contrario.
   */
  static async createAsAdmin(student: Partial<Estudiante>): Promise<boolean> {
    const res = await fetch('/api/admin/create-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student })
    });
    return res.ok;
  }
}
