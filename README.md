# AcademiaSync - Sistema de Gestión Universitaria

Este proyecto es un producto mínimo viable (MVP) diseñado para la gestión académica institucional, permitiendo la interacción entre estudiantes y administradores mediante una arquitectura full-stack moderna basada en React y Express.

## 🚀 Requisitos de Ejecución

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en Desarrollo**:
   ```bash
   npm run dev
   ```

3. **Acceso Web**:
   Abra su navegador en `http://localhost:3000`

## 👥 Usuarios de Prueba (Demo)

Para probar las diferentes funcionalidades del sistema, puede utilizar las siguientes credenciales:

### Rol: Estudiante
- **Email**: `juan.perez@univirtual.edu.co`
- **PIN**: `1234`
- **Capacidades**: Inscribir materias, ver horario, historial académico, reprogramar asignaturas y perfil personal.

### Rol: Administrador
- **Email**: `admin@univirtual.edu.co`
- **PIN**: `1234`
- **Capacidades**: Gestión completa (CRUD) de estudiantes: listar, crear, actualizar y eliminar.

## 📋 Funcionalidades del MVP (RN-001)

### Pantalla 1: Transacción de Negocio (Matrícula)
Permite a los estudiantes navegar por el catálogo de asignaturas ofrecidas, verificar cumplimiento de prerrequisitos y realizar la reserva de cupos en tiempo real mediante la persistencia en CSV.

### Pantalla 2: CRUD de Entidad (Estudiantes)
Modulo exclusivo para el rol `admin` donde se centraliza la información de los usuarios del sistema, permitiendo la edición de estados académicos y créditos máximos.

## 🛠️ Tecnologías Utilizadas
- **Frontend**: React 18, Tailwind CSS, Motion (para animaciones).
- **Backend**: Express.js (Node.js).
- **Persistencia**: Sistema de archivos CSV para asegurar portabilidad y simplicidad.
- **Iconografía**: Lucide-React.

## 📐 Trazabilidad
El código sigue una estructura de capas:
- `model/`: Definición de interfaces y tipos de datos.
- `controller/`: Lógica de negocio y manejo de eventos.
- `persistence/`: Repositorios y comunicación con la API (CSV).
- `view/`: Componentes UI integrados en `App.tsx`.
