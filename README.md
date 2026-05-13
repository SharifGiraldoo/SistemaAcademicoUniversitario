# AcademiaSync v2.0 - Sistema de Gestión Académica

**AcademiaSync** es una plataforma integral diseñada para la automatización y optimización del proceso de matrícula académica de la Universidad del Quindío. El sistema permite a estudiantes y administrativos gestionar la oferta académica, inscripciones, horarios y seguimiento crediticio en tiempo real.

---

## 🚀 Guía de Inicio Rápido

### Acceso al Sistema
La aplicación cuenta con un sistema de autenticación diferenciado por roles:

#### 1. Perfil Estudiante (Demo)
- **Email:** `estudiante@uniquindio.edu.co`
- **Contraseña:** *Cualquier valor*
- **Semestre Inicial:** Se solicita un semestre (1-10) al ingresar para filtrar la oferta académica correspondiente.

#### 2. Perfil Administrador (Demo)
- **Email:** `admin@uniquindio.edu.co`
- **Contraseña:** `admin123`
- **Capacidades:** Gestión de cupos, monitoreo de estudiantes y notificaciones globales.

---

## 🛠 Estructura del Proyecto

El proyecto sigue una arquitectura modular y escalable organizada de la siguiente manera:

```text
/src
├── components/          # Componentes de UI reutilizables (Botones, Cards, etc.)
├── controllers/         # Lógica de orquestación (Hooks personalizados para inscripción)
│   └── InscripcionController.ts
├── data/               # Fuentes de datos estáticas y mock (CSV de asignaturas)
│   └── asignaturas.csv
├── models/             # Definición de interfaces, tipos y enums
│   └── enums/          # Estado de inscripción, estado de estudiante, etc.
├── persistence/        # Abstracción de acceso a datos (Repositorios)
├── services/           # Lógica de negocio core (Validaciones, cálculos de créditos)
│   └── InscripcionService.ts
├── utils/              # Constantes, mensajes de error y helpers
│   └── Constants.ts
├── App.tsx             # Componente principal y enrutamiento de vistas
└── index.css           # Estilos globales y configuración de Tailwind
```

---

## 📋 Requisitos Funcionales Implementados

| ID | Requisito | Descripción |
|---|---|---|
| **001** | Autenticación | Login seguro para estudiantes y administrativos. |
| **002** | Consulta de Oferta | Filtro dinámico de materias por semestre y búsqueda por nombre/código. |
| **003** | Operaciones Académicas | Inscripción, cancelación y reprogramación de asignaturas. |
| **004** | Validación de Estado | Bloqueo de operaciones para estudiantes inactivos. |
| **005** | Reglas Académicas | Validación automática de prerrequisitos y cruce de horarios. |
| **006** | Periodos Permitidos | Restricción de operaciones fuera de las fechas de matrícula. |
| **007** | Registro Exitoso | Persistencia de la inscripción tras validar todas las reglas. |
| **008** | Liberación de Cupos | Actualización instantánea de disponibilidad al cancelar. |
| **009** | Reprogramación | Cambio ágil de asignaturas mediante baja/alta atómica. |
| **010** | Tiempo Real | Actualización visual de créditos, cupos y historial académico. |

---

## ⚖️ Reglas de Negocio (Business Rules)

El sistema aplica estrictamente las siguientes validaciones:

1.  **Restricción de Semestre:** Un estudiante solo puede ver e inscribir materias del semestre que ingresó en el login. No puede ver materias anteriores ni superiores.
2.  **Prerrequisitos:** No se permite la inscripción si el estudiante no tiene aprobadas las materias previas (según el plan de estudios 2016).
3.  **Límite de Créditos:** Cada estudiante tiene un máximo de créditos permitido (ej. 18 créditos) que no puede ser excedido.
4.  **Cruce de Horarios:** El sistema detecta si dos materias comparten el mismo bloque horario antes de permitir la inscripción.
5.  **Cupos Agotados:** Si la asignatura alcanza su capacidad máxima, no permite más inscripciones.

---

## 🎨 Características de Diseño

- **Interfaz "Glassmorphism":** Uso de transparencias y gradientes modernos (Tailwind CSS).
- **Plan de Estudios Visual:** Representación tipo "Nervio" del currículo completo con indicadores de progreso.
- **Horario Dinámico:** Generación automática de la cuadrícula semanal basada en las materias inscritas.
- **Feedback Inmediato:** Notificaciones visuales claras para cada acción (Éxito/Error).

---

## 💻 Tecnologías Utilizadas

- **Frontend:** React 18+ (Hooks & Functional Components).
- **Lenguaje:** TypeScript (Tipado estricto para seguridad).
- **Estilos:** Tailwind CSS v4 (Utilidades modernas).
- **Animaciones:** Motion (motion/react) para transiciones fluidas.
- **Iconografía:** Lucide React.
