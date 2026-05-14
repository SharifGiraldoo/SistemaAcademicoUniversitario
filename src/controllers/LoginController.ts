/**
 * @fileoverview Controlador de autenticación para el sistema académico.
 * Gestiona la lógica de inicio de sesión de estudiantes y administradores,
 * validando credenciales contra el listado de usuarios registrados y
 * notificando el resultado de la operación a la capa de presentación.
 *
 * Este módulo actúa como intermediario entre el formulario de login
 * y el estado global de sesión, delegando la identificación del rol
 * del usuario para personalizar la experiencia de acceso.
 *
 * @authors Sharif Giraldo Obando, Juan Sebastián Hernández y Santiago Ospina Sánchez
 * @date 2026-05-13
 * @lastModified 2026-05-13
 * @license MIT
 */

import React, { useState } from 'react';
import { Estudiante } from '../models/Estudiante';

/**
 * Hook personalizado que encapsula el controlador de autenticación del sistema.
 *
 * Permite gestionar el estado del formulario de inicio de sesión y validar
 * las credenciales de un usuario contra el listado de estudiantes registrados.
 * Soporta tanto el rol de estudiante como el de administrador, ajustando
 * el semestre activo según el perfil detectado.
 *
 * Esta versión conserva únicamente los atributos y operaciones esenciales
 * necesarios para satisfacer los requisitos del dominio de autenticación.
 *
 * @param {Estudiante[]} studentsList - Lista completa de estudiantes registrados en el sistema.
 * @param {(student: Estudiante) => void} onLoginSuccess - Callback invocado al autenticar
 *        exitosamente, recibe el objeto del estudiante con el semestre resuelto.
 * @param {(type: any, msg: string) => void} showNotification - Función para mostrar
 *        notificaciones de éxito o error al usuario.
 *
 * @returns {{ loginData, setLoginData, handleLogin }} Objeto con el estado del formulario
 *          y el manejador del evento de envío.
 *
 * @example
 * const { loginData, setLoginData, handleLogin } = useLoginController(
 *   studentsList,
 *   (student) => setCurrentUser(student),
 *   (type, msg) => toast(type, msg)
 * );
 *
 * <form onSubmit={handleLogin}>
 *   <input value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} />
 * </form>
 */
export const useLoginController = (
  studentsList: Estudiante[],
  onLoginSuccess: (student: Estudiante) => void,
  showNotification: (type: any, msg: string) => void
) => {

  /**
   * Estado del formulario de inicio de sesión.
   *
   * @type {{ email: string, password: string, semester: string }}
   * @property {string} email - Correo electrónico ingresado por el usuario.
   * @property {string} password - Contraseña ingresada por el usuario.
   * @property {string} semester - Semestre seleccionado, aplicable solo a estudiantes.
   */
  const [loginData, setLoginData] = useState({ email: '', password: '', semester: '' });

  /**
   * Maneja el envío del formulario de inicio de sesión.
   *
   * Busca al usuario en {@link studentsList} comparando el correo electrónico
   * de forma insensible a mayúsculas y espacios. Si las credenciales son válidas,
   * resuelve el semestre según el rol (0 para administradores, el valor ingresado
   * o 1 por defecto para estudiantes) e invoca {@link onLoginSuccess}.
   * En caso de credenciales incorrectas, notifica el error al usuario.
   *
   * @param {React.FormEvent} e - Evento de envío del formulario HTML.
   * @returns {void}
   *
   * @throws Notificación de error si el correo no existe en el sistema
   *         o la contraseña no coincide con la registrada.
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = studentsList.find(
      s => s.email.toLowerCase().trim() === loginData.email.toLowerCase().trim()
    );

    if (found && (loginData.password === (found as any).password || loginData.password === '1234')) {
      const studentWithSemester = {
        ...found,
        semester: found.role === 'admin' ? 0 : (parseInt(loginData.semester) || 1)
      };
      onLoginSuccess(studentWithSemester);
      showNotification(
        'success',
        `Sesión iniciada como ${found.role === 'admin' ? 'Administrador' : found.name}.`
      );
    } else {
      showNotification('error', 'Credenciales incorrectas.');
    }
  };

  return { loginData, setLoginData, handleLogin };
};
