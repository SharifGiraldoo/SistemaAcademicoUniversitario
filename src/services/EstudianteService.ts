/**
 * @fileoverview Servicio de validación de estudiantes para el sistema académico.
 * Concentra la lógica de dominio relacionada con las reglas de negocio
 * aplicables a los estudiantes, tales como la verificación del estado
 * de actividad académica y la disponibilidad de créditos para nuevas
 * inscripciones dentro del período vigente.
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

import { Estudiante } from '../models/Estudiante';
import { EstadoEstudiante } from '../models/enums/EstadoEstudiante';

/**
 * Servicio estático de validación de reglas de negocio para estudiantes.
 *
 * Permite clasificar y verificar las condiciones necesarias asociadas
 * a un estudiante antes de permitir operaciones dentro del sistema,
 * tales como confirmar su estado activo y la disponibilidad de créditos
 * académicos para cursar nuevas asignaturas.
 *
 * Esta versión conserva únicamente los métodos esenciales necesarios
 * para satisfacer los requisitos del dominio académico.
 *
 * @class EstudianteService
 *
 * @example
 * const activo = EstudianteService.isActivo(estudiante);
 * if (!activo) console.warn('El estudiante no se encuentra activo.');
 *
 * const disponible = EstudianteService.hasCreditsAvailable(estudiante, 12, 3);
 * if (!disponible) console.warn('El estudiante ha superado el límite de créditos.');
 */
export class EstudianteService {

  /**
   * Verifica si un estudiante se encuentra en estado activo dentro del sistema.
   *
   * Compara el estado actual del estudiante contra el valor
   * {@link EstadoEstudiante.ACTIVE}, retornando `true` únicamente
   * cuando el estudiante está habilitado para realizar operaciones
   * académicas como inscripciones o cancelaciones.
   *
   * @static
   * @param {Estudiante} estudiante - Estudiante cuyo estado de actividad se desea verificar.
   *
   * @returns {boolean} `true` si el estudiante está activo, `false` en cualquier otro estado
   *          (inactivo, suspendido, graduado, etc.).
   *
   * @example
   * const activo = EstudianteService.isActivo(estudiante);
   * // activo: true  →  estudiante.status === EstadoEstudiante.ACTIVE
   * // activo: false →  estudiante.status === EstadoEstudiante.INACTIVE
   */
  static isActivo(estudiante: Estudiante): boolean {
    return estudiante.status === EstadoEstudiante.ACTIVE;
  }

  /**
   * Verifica si un estudiante dispone de créditos suficientes para inscribir una asignatura.
   *
   * Suma los créditos actualmente inscritos más los créditos de la asignatura
   * candidata, y comprueba que el total no supere el límite máximo de créditos
   * permitido para el estudiante en el período académico vigente.
   *
   * @static
   * @param {Estudiante} estudiante - Estudiante sobre el cual se evalúa la disponibilidad de créditos.
   * @param {number} currentCredits - Total de créditos que el estudiante tiene inscritos actualmente.
   * @param {number} subjectCredits - Créditos correspondientes a la asignatura que se desea inscribir.
   *
   * @returns {boolean} `true` si la suma de créditos actuales más los de la asignatura
   *          no excede el máximo permitido, `false` en caso contrario.
   *
   * @example
   * const disponible = EstudianteService.hasCreditsAvailable(estudiante, 12, 3);
   * // disponible: true  →  (12 + 3) = 15 <= estudiante.maxCredits (18)
   * // disponible: false →  (12 + 3) = 15 >  estudiante.maxCredits (12)
   */
  static hasCreditsAvailable(
    estudiante: Estudiante,
    currentCredits: number,
    subjectCredits: number
  ): boolean {
    return (currentCredits + subjectCredits) <= estudiante.maxCredits;
  }
}
