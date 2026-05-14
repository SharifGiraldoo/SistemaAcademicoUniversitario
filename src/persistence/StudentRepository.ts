/**
 * Representa el repositorio encargado de gestionar
 * las operaciones administrativas relacionadas con
 * los estudiantes dentro del sistema académico.
 *
 * Esta clase permite crear, actualizar y eliminar
 * estudiantes mediante peticiones HTTP hacia los
 * endpoints correspondientes de la API.
 *
 * Su implementación utiliza métodos estáticos para
 * centralizar las funcionalidades de persistencia
 * y manejo de información de estudiantes.
 *
 * Además, incorpora manejo de excepciones para
 * controlar posibles errores durante la comunicación
 * con el servidor.
 *
 * Autores: [Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez]
 *
 * Fecha de última modificación: 2026-05-13
 *
 * Licencia: Licencia MIT
 */
export class StudentRepository {

  /**
   * Actualiza la información de un estudiante
   * existente dentro del sistema académico.
   *
   * @param {string} id Identificador del estudiante
   * que será actualizado.
   *
   * @param {Partial<Estudiante>} student Información
   * parcial del estudiante con los nuevos datos.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si la actualización fue exitosa o false en caso contrario.
   */
  static async update(id: string, student: Partial<Estudiante>): Promise<boolean> {
    try {
      const res = await fetch(`/api/student/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student })
      });
      return res.ok;
    } catch (err) {
      console.error("Error updating student:", err);
      return false;
    }
  }

  /**
   * Registra un nuevo estudiante dentro del sistema
   * académico mediante una petición HTTP de tipo POST.
   *
   * @param {Estudiante} student Estudiante que será
   * registrado en el sistema.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si el registro fue exitoso o false en caso contrario.
   */
  static async create(student: Estudiante): Promise<boolean> {
    try {
      const res = await fetch(`/api/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student })
      });
      return res.ok;
    } catch (err) {
      console.error("Error creating student:", err);
      return false;
    }
  }

  /**
   * Elimina un estudiante existente del sistema
   * utilizando su identificador único.
   *
   * @param {string} id Identificador del estudiante
   * que será eliminado.
   *
   * @returns {Promise<boolean>} Promesa que retorna true
   * si la eliminación fue exitosa o false en caso contrario.
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/student/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error("Error deleting student:", err);
      return false;
    }
  }
}
