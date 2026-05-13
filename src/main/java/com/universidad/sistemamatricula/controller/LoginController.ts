import React, { useState } from 'react';
import { Estudiante } from '../model/Estudiante';

export const useLoginController = (studentsList: Estudiante[], onLoginSuccess: (student: Estudiante) => void, showNotification: (type: any, msg: string) => void) => {
  const [loginData, setLoginData] = useState({ email: '', password: '', semester: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = studentsList.find(s => s.email.toLowerCase().trim() === loginData.email.toLowerCase().trim());
    
    if (found && loginData.password === '1234') {
      const studentWithSemester = { 
        ...found, 
        semester: found.role === 'admin' ? 0 : (parseInt(loginData.semester) || 1) 
      };
      onLoginSuccess(studentWithSemester);
      showNotification('success', `Sesión iniciada como ${found.role === 'admin' ? 'Administrador' : found.name}.`);
    } else {
      showNotification('error', 'Credenciales incorrectas (Demo: juan.perez@univirtual.edu.co / admin@univirtual.edu.co , PIN: 1234)');
    }
  };

  return { loginData, setLoginData, handleLogin };
};
