import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "src/data");

// Helper for emailing
const transporter = nodemailer.createTransport({
  service: 'gmail', // Defaulting to gmail, user can change
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper to read CSV
function readCSV<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf-8");
  return parse(content, { columns: true, skip_empty_lines: true });
}

// Helper to write CSV
function writeCSV(filename: string, data: any[]) {
  const filePath = path.join(DATA_DIR, filename);
  const content = stringify(data, { header: true });
  fs.writeFileSync(filePath, content);
}

// API Routes
app.post("/api/admin/create-student", async (req, res) => {
  const { student } = req.body;
  if (!student) return res.status(400).json({ error: "Faltan datos del estudiante" });
  
  const students = readCSV("estudiantes.csv");
  if (students.some((s: any) => s.id === student.id || s.email === student.email)) {
    return res.status(400).json({ error: "El ID o Email ya se encuentran registrados" });
  }

  students.push(student);
  writeCSV("estudiantes.csv", students);

  // Send Email
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"AcademiaSync Support" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: "Bienvenido a AcademiaSync - Tus Credenciales de Acceso",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h1 style="color: #059669;">¡Bienvenido, ${student.name}!</h1>
            <p>Tu cuenta ha sido creada exitosamente por el administrador.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Email:</strong> ${student.email}</p>
              <p><strong>Password:</strong> ${student.password}</p>
              <p><strong>ID Universitario:</strong> ${student.id}</p>
            </div>
            <p>Puedes iniciar sesión ahora para comenzar tu proceso de matrícula.</p>
            <p style="font-size: 12px; color: #666; margin-top: 30px;">AcademiaSync v2.0 - Gestión Académica Universitaria</p>
          </div>
        `
      });
      console.log(`Email enviado con éxito a ${student.email}`);
    } else {
      console.log("AVISO: No se enviaron correos porque EMAIL_USER o EMAIL_PASS no están configurados en .env");
    }
  } catch (error) {
    console.error("Error enviando email:", error);
    // Even if email fails, student was created in CSV
  }

  res.json({ success: true, emailSent: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS) });
});

app.get("/api/messages", (req, res) => {
  res.json(readCSV("mensajes.csv"));
});

app.post("/api/messages", (req, res) => {
  const message = req.body;
  const messages = readCSV("mensajes.csv");
  const newMessage = {
    ...message,
    id: `MSG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false
  };
  messages.push(newMessage);
  writeCSV("mensajes.csv", messages);
  res.status(201).json(newMessage);
});

app.post("/api/messages/mark-read", (req, res) => {
  const { senderId } = req.body;
  const messages = readCSV<any>("mensajes.csv");
  const updated = messages.map(m => 
    m.senderId === senderId && m.receiverId === 'admin' ? { ...m, read: true } : m
  );
  writeCSV("mensajes.csv", updated);
  res.json({ success: true });
});

app.get("/api/notifications", (req, res) => {
  res.json(readCSV("notificaciones.csv"));
});

app.post("/api/notifications", (req, res) => {
  const notification = req.body;
  const notifications = readCSV("notificaciones.csv");
  const newNotif = {
    ...notification,
    id: `NOT-${Date.now()}`,
    date: new Date().toISOString(),
    read: false
  };
  notifications.push(newNotif);
  writeCSV("notificaciones.csv", notifications);
  res.status(201).json(newNotif);
});

app.post("/api/notifications/mark-read", (req, res) => {
  const { id, studentId } = req.body;
  const notifications = readCSV<any>("notificaciones.csv");
  const updated = notifications.map(n => {
    if (id && n.id === id) return { ...n, read: true };
    if (studentId && n.studentId === studentId) return { ...n, read: true };
    return n;
  });
  writeCSV("notificaciones.csv", updated);
  res.json({ success: true });
});

app.get("/api/data", (req, res) => {
  console.log("GET /api/data - Cargando datos universitarios");
  const students = readCSV("estudiantes.csv");
  const subjects = readCSV("asignaturas.csv");
  const enrollments = readCSV("inscripciones.csv");
  const history = readCSV("historial.csv");

  res.json({
    students: students.map((s: any) => ({
      ...s,
      maxCredits: parseInt(s.maxCredits) || 0,
      role: s.role || 'student'
    })),
    subjects: subjects.map((s: any) => ({
      ...s,
      credits: parseInt(s.credits) || 0,
      capacity: parseInt(s.capacity) || 0,
      enrolledCount: parseInt(s.enrolledCount) || 0,
      semester: parseInt(s.semester) || 1,
      prerequisites: s.prerequisites ? s.prerequisites.split(";").map((p: string) => p.trim()).filter((p: string) => p !== "") : []
    })),
    enrollments,
    history: history.map((h: any) => ({
      ...h,
      grade: parseFloat(h.grade) || 0
    }))
  });
});

app.post("/api/enroll", (req, res) => {
  const { enrollment } = req.body;
  if (!enrollment) return res.status(400).json({ error: "No enrollment data" });
  
  console.log(`POST /api/enroll - Inscribiendo ${enrollment.subjectCode} para ${enrollment.studentId}`);
  
  const enrollments = readCSV("inscripciones.csv");
  enrollments.push(enrollment);
  writeCSV("inscripciones.csv", enrollments);
  
  // Update enrolledCount in subjects
  const subjects = readCSV("asignaturas.csv");
  const subjectIndex = subjects.findIndex((s: any) => s.code === enrollment.subjectCode);
  if (subjectIndex > -1) {
    const current = parseInt((subjects[subjectIndex] as any).enrolledCount) || 0;
    (subjects[subjectIndex] as any).enrolledCount = current + 1;
    writeCSV("asignaturas.csv", subjects);
    console.log(`Cupo actualizado para ${enrollment.subjectCode}: ${current + 1}`);
  }

  res.json({ success: true });
});

app.put("/api/enroll/:id", (req, res) => {
  const { id } = req.params;
  const { enrollment } = req.body;
  console.log(`PUT /api/enroll/${id} - Actualizando inscripción`);
  let enrollments = readCSV("inscripciones.csv");
  const index = enrollments.findIndex((e: any) => e.id === id);

  if (index > -1) {
    enrollments[index] = enrollment;
    writeCSV("inscripciones.csv", enrollments);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Inscripción no encontrada" });
  }
});

app.delete("/api/enroll/:id", (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/enroll/${id} - Cancelando inscripción`);
  let enrollments = readCSV("inscripciones.csv");
  const enrollment = enrollments.find((e: any) => e.id === id);
  
  if (enrollment) {
    enrollments = enrollments.filter((e: any) => e.id !== id);
    writeCSV("inscripciones.csv", enrollments);

    // Update enrolledCount in subjects
    const subjects = readCSV("asignaturas.csv");
    const subjectIndex = subjects.findIndex((s: any) => s.code === (enrollment as any).subjectCode);
    if (subjectIndex > -1) {
      const current = parseInt((subjects[subjectIndex] as any).enrolledCount) || 0;
      (subjects[subjectIndex] as any).enrolledCount = Math.max(0, current - 1);
      writeCSV("asignaturas.csv", subjects);
      console.log(`Cupo actualizado para ${(enrollment as any).subjectCode}: ${Math.max(0, current - 1)}`);
    }
  }

  res.json({ success: true });
});

app.put("/api/student/:id", (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  console.log(`PUT /api/student/${id} - Actualizando perfil de estudiante`);
  let students = readCSV("estudiantes.csv");
  const index = students.findIndex((s: any) => s.id === id);

  if (index > -1) {
    // Preserve existing data if not provided
    students[index] = Object.assign({}, students[index] as any, student as any);
    writeCSV("estudiantes.csv", students);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Estudiante no encontrado" });
  }
});

app.post("/api/student", (req, res) => {
  const { student } = req.body;
  if (!student) return res.status(400).json({ error: "No student data" });
  
  console.log(`POST /api/student - Creando estudiante ${student.name}`);
  const students = readCSV("estudiantes.csv");
  
  // Check if ID already exists
  if (students.some((s: any) => s.id === student.id)) {
    return res.status(400).json({ error: "El ID ya se encuentra registrado" });
  }

  students.push(student);
  writeCSV("estudiantes.csv", students);
  res.json({ success: true });
});

app.delete("/api/student/:id", (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/student/${id} - Eliminando estudiante`);
  let students = readCSV("estudiantes.csv");
  const filtered = students.filter((s: any) => s.id !== id);
  
  if (students.length !== filtered.length) {
    writeCSV("estudiantes.csv", filtered);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Estudiante no encontrado" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
