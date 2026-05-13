import { Estudiante } from '../models/Estudiante';
import { Asignatura } from '../models/Asignatura';
import { Inscripcion } from '../models/Inscripcion';
import { HistorialAcademico } from '../models/HistorialAcademico';
import { EstadoInscripcion } from '../models/enums/EstadoInscripcion';
import { InscripcionService } from '../services/InscripcionService';
import { InscripcionRepository } from '../persistence/InscripcionRepository';

export const useInscripcionController = (
  student: Estudiante, 
  subjects: Asignatura[], 
  enrollments: Inscripcion[], 
  allHistory: HistorialAcademico[],
  fetchData: () => void,
  showNotification: (type: any, msg: string) => void
) => {
  
  const enroll = async (subject: Asignatura) => {
    console.log(`Intentando inscripción en: ${subject.name} (${subject.code})`);
    
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

  const cancel = async (id: string) => {
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

  const reprogramar = async (id: string) => {
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
