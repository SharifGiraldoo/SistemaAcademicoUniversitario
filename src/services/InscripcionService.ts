/**
 * @fileoverview Servicio de validación de inscripciones para el sistema académico.
 * Centraliza todas las reglas de negocio que deben cumplirse antes de permitir
 * que un estudiante se inscriba en una asignatura, incluyendo verificaciones de
 * estado, cupos, prerrequisitos, créditos, semestre y conflictos de horario.
 *
 * También expone la verificación del período de matrícula vigente, permitiendo
 * a los controladores bloquear operaciones fuera de la ventana habilitada.
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
import { Asignatura } from '../models/Asignatura';
import { Inscripcion } from '../models/Inscripcion';
import { HistorialAcademico } from '../models/HistorialAcademico';
import { EstadoEstudiante } from '../models/enums/EstadoEstudiante';
import { EstadoInscripcion } from '../models/enums/EstadoInscripcion';
import * as Constants from '../utils/Constants';

/**
 * Servicio estático de validación de reglas de negocio para inscripciones académicas.
 *
 * Permite clasificar y verificar el conjunto completo de condiciones necesarias
 * para que una inscripción sea considerada válida dentro del dominio del sistema,
 * aplicando las siguientes reglas de negocio de forma secuencial:
 *
 * - **RN-001**: El estudiante debe estar en estado activo.
 * - **RN-002**: La asignatura debe tener cupos disponibles.
 * - **RN-003**: El estudiante no debe estar ya inscrito en la asignatura.
 * - **RN-005**: El estudiante no debe haber aprobado previamente la asignatura.
 * - **RN-007**: La asignatura no puede pertenecer a un semestre superior al del estudiante.
 * - **RN-006**: Todos los prerrequisitos deben estar completados en el historial.
 * - **RN-004**: La suma de créditos no debe superar el máximo permitido.
 * - **RN-008**: El horario de la asignatura no debe coincidir con el de otra ya inscrita.
 *
 * Esta versión conserva únicamente los métodos esenciales necesarios
 * para satisfacer los requisitos del dominio académico.
 *
 * @class InscripcionService
 *
 * @example
 * const error = InscripcionService.validate(estudiante, asignatura, inscritas, historial, todasLasAsignaturas);
 * if (error) showNotification('error', error);
 *
 * const abierto = InscripcionService.isPeriodOpen();
 * if (!abierto) showNotification('error', 'El período de matrícula está cerrado.');
 */
export class InscripcionService {

  /**
   * Valida si un estudiante puede inscribirse en una asignatura aplicando
   * todas las reglas de negocio del dominio de forma secuencial.
   *
   * Retorna el mensaje de error correspondiente a la primera regla que no
   * se cumpla, o `null` si todas las validaciones son superadas exitosamente,
   * indicando que la inscripción puede proceder.
   *
   * @static
   * @param {Estudiante} estudiante - Estudiante que solicita la inscripción.
   * @param {Asignatura} asignatura - Asignatura en la que se desea inscribir.
   * @param {Inscripcion[]} inscripcionesActuales - Inscripciones vigentes del estudiante
   *        en el período académico actual.
   * @param {HistorialAcademico[]} historial - Historial académico del estudiante con
   *        asignaturas cursadas y sus estados finales.
   * @param {Asignatura[]} totalAsignaturas - Catálogo completo de asignaturas del sistema,
   *        utilizado para calcular créditos y verificar horarios.
   *
   * @returns {string | null} Mensaje descriptivo del error encontrado, o `null`
   *          si todas las reglas de negocio se cumplen satisfactoriamente.
   *
   * @example
   * const error = InscripcionService.validate(estudiante, asignatura, inscritas, historial, catalogo);
   * // error: null                              → inscripción permitida
   * // error: 'Prerrequisito faltante (MAT101)' → inscripción bloqueada
   */
  static validate(
    estudiante: Estudiante,
    asignatura: Asignatura,
    inscripcionesActuales: Inscripcion[],
    historial: HistorialAcademico[],
    totalAsignaturas: Asignatura[]
  ): string | null {

    // RN-001: El estudiante debe encontrarse en estado activo
    if (estudiante.status !== EstadoEstudiante.ACTIVE) {
      return Constants.RN_001_MESSAGE;
    }

    // RN-002: La asignatura debe tener cupos disponibles
    if (asignatura.enrolledCount >= asignatura.capacity) {
      return Constants.RN_002_MESSAGE;
    }

    // RN-003: El estudiante no puede estar ya inscrito en la misma asignatura
    if (inscripcionesActuales.some(e => e.subjectCode === asignatura.code)) {
      return "Ya inscrito en esta asignatura.";
    }

    // RN-005: El estudiante no puede reinscribir una asignatura ya aprobada
    if (historial.some(h => h.subjectCode === asignatura.code && h.status === EstadoInscripcion.COMPLETED)) {
      return Constants.ALREADY_APPROVED_MESSAGE;
    }

    // RN-007: No se pueden inscribir asignaturas de semestres superiores al actual del estudiante
    if (estudiante.semester && asignatura.semester > estudiante.semester) {
      return "No puedes inscribir materias de semestres superiores al actual.";
    }

    // RN-006: Todos los prerrequisitos deben estar aprobados en el historial académico
    for (const pre of asignatura.prerequisites) {
      if (pre && !historial.some(h => h.subjectCode === pre && h.status === EstadoInscripcion.COMPLETED)) {
        return `${Constants.PREREQUISITE_MESSAGE} (Falta: ${pre})`;
      }
    }

    // RN-004: La suma de créditos inscritos más los de la nueva asignatura no debe superar el máximo
    const currentCredits = inscripcionesActuales.reduce((sum, e) => {
      const s = totalAsignaturas.find(sub => sub.code === e.subjectCode);
      return sum + (s?.credits || 0);
    }, 0);
    if (currentCredits + asignatura.credits > estudiante.maxCredits) {
      return Constants.RN_004_MESSAGE;
    }

    // RN-008: El horario de la asignatura no debe coincidir con el de ninguna asignatura ya inscrita
    const schedules = inscripcionesActuales.map(
      e => totalAsignaturas.find(sub => sub.code === e.subjectCode)?.schedule
    );
    if (schedules.includes(asignatura.schedule)) {
      return Constants.SCHEDULE_CONFLICT_MESSAGE;
    }

    return null;
  }

  /**
   * Indica si el período de matrícula se encuentra actualmente abierto.
   *
   * En esta implementación el período se simula siempre como abierto.
   * En un entorno de producción, este valor debe obtenerse desde una
   * configuración centralizada persistida en base de datos, permitiendo
   * que los administradores habiliten o cierren el período dinámicamente.
   *
   * @static
   * @returns {boolean} `true` si el período de matrícula está abierto,
   *          `false` si está cerrado y no se permiten operaciones de inscripción.
   *
   * @example
   * const abierto = InscripcionService.isPeriodOpen();
   * // abierto: true  → operaciones de inscripción habilitadas
   * // abierto: false → operaciones de inscripción bloqueadas
   */
  static isPeriodOpen(): boolean {
    // Simulamos que el período de matrícula está abierto.
    // En una app real esto vendría de una configuración del sistema en la DB.
    return true;
  }
}
