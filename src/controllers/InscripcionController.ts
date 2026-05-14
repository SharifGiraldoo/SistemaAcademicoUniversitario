/**
 * @fileoverview Controlador de inscripciones para el sistema académico.
 * Gestiona la lógica de interacción entre la vista y los servicios
 * de inscripción, incluyendo matriculación, cancelación, actualización
 * y reprogramación de asignaturas por parte de un estudiante.
 *
 * Este módulo actúa como intermediario entre la capa de presentación
 * y los servicios de dominio, delegando las validaciones de negocio
 * al {@link InscripcionService} y la persistencia al {@link InscripcionRepository}.
 *
 * @authors Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez
 * @date 2026-05-13
 * @lastModified 2025-11-16
 * @license MIT
 */

import { Estudiante } from '../models/Estudiante';
import { Asignatura } from '../models/Asignatura';
import { Inscripcion } from '../models/Inscripcion';
import { HistorialAcademico } from '../models/HistorialAcademico';
import { EstadoInscripcion } from '../models/enums/EstadoInscripcion';
import { InscripcionService } from '../services/InscripcionService';
import { InscripcionRepository } from '../persistence/InscripcionRepository';
import * as Constants from '../utils/Constants';

/**
 * Hook personalizado que encapsula el controlador de inscripciones académicas.
 *
 * Permite clasificar y gestionar las operaciones sobre inscripciones
 * de un estudiante en áreas temáticas del sistema, tales como:
 * matriculación en nuevas asignaturas, cancelación, actualización
 * de datos y reprogramación para semestres futuros.
 *
 * Esta versión conserva únicamente las operaciones esenciales
 * necesarias para satisfacer los requisitos del dominio académico.
 *
 * @param {Estudiante} student - Estudiante sobre el cual se realizan las operaciones.
 * @param {Asignatura[]} subjects - Lista completa de asignaturas disponibles en el sistema.
 * @param {Inscripcion[]} enrollments - Inscripciones activas del estudiante en el período actual.
 * @param {HistorialAcademico[]} allHistory - Historial académico completo de todos los estudiantes.
 * @param {() => void} fetchData - Función de recarga de datos tras una operación exitosa.
 * @param {(type: any, msg: string) => void} showNotification - Función para mostrar notificaciones al usuario.
 *
 * @returns {{ enroll, cancel, updateEnrollment, reprogramar }} Objeto con las acciones disponibles del controlador.
 *
 * @example
 * const { enroll, cancel } = useInscripcionController(
 *   student, subjects, enrollments, allHistory, fetchData, showNotification
 * );
 * await enroll(asignaturaSeleccionada);
 */
export const useInscripcionController = (
  student: Estudiante, 
  subjects: Asignatura[], 
  enrollments: Inscripcion[], 
  allHistory: HistorialAcademico[],
  fetchData: () => void,
  showNotification: (type: any, msg: string) => void
) => {
  
  /**
   * Matricula al estudiante en una asignatura específica.
   *
   * Verifica que el período de inscripción esté abierto, aplica las
   * validaciones de negocio definidas en {@link InscripcionService.validate}
   * y persiste la nueva inscripción mediante {@link InscripcionRepository.save}.
   *
   * @async
   * @param {Asignatura} subject - Asignatura en la que se desea matricular el estudiante.
   * @returns {Promise<void>}
   *
   * @throws Notificación de error si el período está cerrado, la validación falla
   *         o se produce un error de red.
   */
  const enroll = async (subject: Asignatura) => {
    console.log(`Intentando inscripción en: ${subject.name} (${subject.code})`);
    
    if (!InscripcionService.isPeriodOpen()) {
      showNotification('error', Constants.OUT_OF_PERIOD_MESSAGE);
      return;
    }

    // Validar reglas de negocio
    const error = InscripcionService.validate(
      student, 
      subject, 
      enrollments.filter(e => e.studentId === student.id), 
      allHistory.filter(h => h.studentId === student.id), 
      subjects
    );
    
    if (error) {
      console.warn(`Error de validación: ${error}`);
      showNotification('error', error);
      return;
    }

    const enrollment: Inscripcion = {
      id: `ENR-${Date.now()}`,
      studentId: student.id,
      subjectCode: subject.code,
      date: new Date().toISOString(),
      status: EstadoInscripcion.ENROLLED
    };

    try {
      const success = await InscripcionRepository.save(enrollment);
      if (success) {
        showNotification('success', `¡Exitoso! Te has matriculado en ${subject.name}.`);
        fetchData();
      } else {
        showNotification('error', 'El servidor rechazó la inscripción.');
      }
    } catch (err) {
      console.error("Fallo de red en inscripción:", err);
      showNotification('error', 'Error crítico de conexión al servidor.');
    }
  };

  /**
   * Cancela una inscripción existente del estudiante.
   *
   * Verifica que el período de inscripción esté abierto antes de
   * proceder con la eliminación mediante {@link InscripcionRepository.delete}.
   *
   * @async
   * @param {string} id - Identificador único de la inscripción a cancelar.
   * @returns {Promise<void>}
   *
   * @throws Notificación de error si el período está cerrado o se produce un error de red.
   */
  const cancel = async (id: string) => {
    if (!InscripcionService.isPeriodOpen()) {
      showNotification('error', Constants.OUT_OF_PERIOD_MESSAGE);
      return;
    }
    try {
      const success = await InscripcionRepository.delete(id);
      if (success) {
        showNotification('success', 'Asignatura cancelada correctamente.');
        fetchData();
      } else {
        showNotification('error', 'No se pudo cancelar la asignatura.');
      }
    } catch (err) {
      showNotification('error', 'Error de red al intentar cancelar.');
    }
  };

  /**
   * Actualiza parcialmente los datos de una inscripción existente.
   *
   * Busca la inscripción original por su identificador, combina los
   * datos actualizados y persiste el resultado mediante {@link InscripcionRepository.update}.
   * No requiere que el período de inscripción esté abierto.
   *
   * @async
   * @param {string} id - Identificador único de la inscripción a actualizar.
   * @param {Partial<Inscripcion>} updatedData - Campos a modificar sobre la inscripción original.
   * @returns {Promise<void>}
   *
   * @throws Notificación de error si la inscripción no existe o se produce un error de red.
   */
  const updateEnrollment = async (id: string, updatedData: Partial<Inscripcion>) => {
    const original = enrollments.find(e => e.id === id);
    if (!original) return;

    const updated: Inscripcion = { ...original, ...updatedData };
    
    try {
      const success = await InscripcionRepository.update(id, updated);
      if (success) {
        showNotification('success', 'Inscripción actualizada correctamente.');
        fetchData();
      } else {
        showNotification('error', 'Error al actualizar la inscripción.');
      }
    } catch (err) {
      showNotification('error', 'Error de red al intentar actualizar.');
    }
  };

  /**
   * Reprograma una inscripción para ser cursada en un semestre futuro.
   *
   * Verifica que el período de inscripción esté abierto, actualiza el
   * estado de la inscripción a {@link EstadoInscripcion.REPROGRAMADA}
   * y persiste el cambio mediante {@link InscripcionRepository.update}.
   *
   * @async
   * @param {string} id - Identificador único de la inscripción a reprogramar.
   * @returns {Promise<void>}
   *
   * @throws Notificación de error si el período está cerrado, la inscripción
   *         no existe o se produce un error de red.
   */
  const reprogramar = async (id: string) => {
    if (!InscripcionService.isPeriodOpen()) {
      showNotification('error', Constants.OUT_OF_PERIOD_MESSAGE);
      return;
    }
    try {
      const original = enrollments.find(e => e.id === id);
      if (!original) return;

      const updated: Inscripcion = { ...original, status: EstadoInscripcion.REPROGRAMADA };
      const success = await InscripcionRepository.update(id, updated);
      
      if (success) {
        showNotification('success', 'Asignatura reprogramada para otro semestre.');
        fetchData();
      } else {
        showNotification('error', 'No se pudo reprogramar la asignatura.');
      }
    } catch (err) {
      showNotification('error', 'Error de red al intentar reprogramar.');
    }
  };

  return { enroll, cancel, updateEnrollment, reprogramar };
};
  return { enroll, cancel, updateEnrollment, reprogramar };
};
