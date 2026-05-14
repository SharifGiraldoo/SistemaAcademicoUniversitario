/**
 * @fileoverview Servicio de validación de asignaturas para el sistema académico.
 * Concentra la lógica de dominio relacionada con las reglas de negocio
 * aplicables a las asignaturas, tales como la verificación de prerrequisitos
 * cumplidos en el historial académico del estudiante y la disponibilidad
 * de cupos en una asignatura determinada.
 *
 * Este módulo actúa como capa de servicio puro, sin dependencias de estado
 * ni efectos secundarios, facilitando su reutilización desde cualquier
 * controlador o componente del sistema.
 *
 * @authors Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez
 * @date 2026-05-13
 * @lastModified 2026-05-13
 * @license MIT
 */

import { Asignatura } from '../models/Asignatura';
import { HistorialAcademico } from '../models/HistorialAcademico';
import { EstadoInscripcion } from '../models/enums/EstadoInscripcion';

/**
 * Servicio estático de validación de reglas de negocio para asignaturas.
 *
 * Permite clasificar y verificar las condiciones necesarias para que
 * un estudiante pueda inscribirse en una asignatura, tales como el
 * cumplimiento de prerrequisitos académicos y la disponibilidad de cupos.
 *
 * Esta versión conserva únicamente los métodos esenciales necesarios
 * para satisfacer los requisitos del dominio académico.
 *
 * @class AsignaturaService
 *
 * @example
 * const { met, missing } = AsignaturaService.hasPrerequisites(asignatura, historial);
 * if (!met) console.warn('Prerrequisitos faltantes:', missing);
 *
 * const available = AsignaturaService.hasCapacity(asignatura);
 * if (!available) console.warn('No hay cupos disponibles.');
 */
export class AsignaturaService {

  /**
   * Verifica si un estudiante cumple con todos los prerrequisitos de una asignatura.
   *
   * Recorre la lista de prerrequisitos definidos en la asignatura y comprueba
   * que cada uno aparezca en el historial académico del estudiante con estado
   * {@link EstadoInscripcion.COMPLETED}. Si la asignatura no tiene prerrequisitos
   * definidos, retorna directamente como satisfecha.
   *
   * @static
   * @param {Asignatura} asignatura - Asignatura cuyas condiciones de acceso se desean verificar.
   * @param {HistorialAcademico[]} history - Historial académico del estudiante con
   *        los códigos y estados de asignaturas cursadas previamente.
   *
   * @returns {{ met: boolean, missing: string[] }} Objeto con el resultado de la validación:
   *   - `met`: `true` si todos los prerrequisitos están completados, `false` en caso contrario.
   *   - `missing`: arreglo con los códigos de los prerrequisitos aún no superados.
   *
   * @example
   * const { met, missing } = AsignaturaService.hasPrerequisites(asignatura, historial);
   * // met: false, missing: ['MAT101', 'FIS101']
   */
  static hasPrerequisites(
    asignatura: Asignatura,
    history: HistorialAcademico[]
  ): { met: boolean, missing: string[] } {
    if (!asignatura.prerequisites || asignatura.prerequisites.length === 0) {
      return { met: true, missing: [] };
    }
    const missing = asignatura.prerequisites.filter(pre =>
      !history.some(h => h.subjectCode === pre && h.status === EstadoInscripcion.COMPLETED)
    );
    return { met: missing.length === 0, missing };
  }

  /**
   * Verifica si una asignatura tiene cupos disponibles para nuevas inscripciones.
   *
   * Compara el número de estudiantes actualmente inscritos contra la capacidad
   * máxima definida para la asignatura, retornando `true` únicamente cuando
   * aún existe al menos un cupo libre.
   *
   * @static
   * @param {Asignatura} asignatura - Asignatura cuya disponibilidad de cupos se desea verificar.
   *
   * @returns {boolean} `true` si el número de inscritos es menor a la capacidad máxima,
   *          `false` si la asignatura está llena.
   *
   * @example
   * const disponible = AsignaturaService.hasCapacity(asignatura);
   * // disponible: true  →  enrolledCount (28) < capacity (30)
   * // disponible: false →  enrolledCount (30) >= capacity (30)
   */
  static hasCapacity(asignatura: Asignatura): boolean {
    return asignatura.enrolledCount < asignatura.capacity;
  }
}
