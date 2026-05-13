import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  History, 
  LayoutDashboard, 
  LogOut, 
  Search, 
  User, 
  X,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Info,
  Filter,
  Camera,
  Save,
  PieChart,
  Layers,
  Send,
  MessagesSquare,
  MessageCircle,
  Bell,
  BellRing,
  Megaphone,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Models
import { Estudiante } from './models/Estudiante';
import { Asignatura } from './models/Asignatura';
import { Inscripcion } from './models/Inscripcion';
import { HistorialAcademico } from './models/HistorialAcademico';
import { EstadoEstudiante } from './models/enums/EstadoEstudiante';
import { EstadoInscripcion } from './models/enums/EstadoInscripcion';

// Controllers & Services
import { useLoginController } from './controllers/LoginController';
import { useInscripcionController } from './controllers/InscripcionController';
import { InscripcionRepository } from './persistence/InscripcionRepository';
import { AsignaturaRepository } from './persistence/AsignaturaRepository';
import { EstudianteRepository } from './persistence/EstudianteRepository';
import { MessageRepository } from './persistence/MessageRepository';
import { NotificationRepository } from './persistence/NotificationRepository';
import { MensajeSoporte } from './models/MensajeSoporte';
import { Notificacion, TipoNotificacion } from './models/Notificacion';
import { CsvManager } from './persistence/CsvManager';

import { StudentRepository } from './persistence/StudentRepository';

// --- Shared Components ---

const Card = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; key?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`glass rounded-3xl border border-white/50 shadow-2xl overflow-hidden hover:shadow-emerald-500/10 transition-all duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

const BackgroundBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <motion.div 
      animate={{ 
        x: [0, 100, 0], 
        y: [0, 50, 0],
        scale: [1, 1.2, 1],
        rotate: [0, 45, 0]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[120px]"
    />
    <motion.div 
      animate={{ 
        x: [0, -80, 0], 
        y: [0, 100, 0],
        scale: [1, 1.3, 1],
        rotate: [0, -30, 0]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-green-400/10 rounded-full blur-[100px]"
    />
    <motion.div 
      animate={{ 
        x: [0, 50, 0], 
        y: [0, -100, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-teal-400/10 rounded-full blur-[140px]"
    />
  </div>
);

const Badge = ({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' }) => {
  const styles = {
    primary: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    success: 'bg-green-50 text-green-700 border-green-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
    neutral: 'bg-gray-50 text-gray-700 border-gray-100',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[variant]}`}>
      {children}
    </span>
  );
};

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert = ({ type, message, onClose }: AlertProps) => {
  const styles = {
    error: 'bg-rose-500 text-white shadow-rose-500/30',
    success: 'bg-emerald-500 text-white shadow-emerald-500/30',
    warning: 'bg-amber-500 text-white shadow-amber-500/30',
    info: 'bg-slate-800 text-white shadow-slate-800/30'
  };

  const icons = {
    error: <X className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`fixed bottom-10 right-10 z-[100] flex items-center gap-4 px-8 py-5 rounded-2.5xl shadow-2xl ${styles[type]} backdrop-blur-md`}
    >
      <div className="p-2 bg-white/20 rounded-xl">
        {icons[type]}
      </div>
      <p className="font-black text-xs uppercase tracking-widest leading-none">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 opacity-50" />
        </button>
      )}
    </motion.div>
  );
};

// --- Views (Extracted to prevent remount on state change) ---

interface CurriculumViewProps {
  subjects: Asignatura[];
  allHistory: HistorialAcademico[];
  student: Estudiante;
}

const CurriculumView = ({ subjects, allHistory, student }: CurriculumViewProps) => {
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const myHistory = allHistory.filter(h => h.studentId === student.id);

  return (
    <div className="space-y-12">
      <header className="relative">
        <h2 className="text-4xl font-black tracking-tight text-slate-900 border-l-8 border-emerald-500 pl-6 uppercase italic">Plan de Estudios Oficial</h2>
        <p className="text-slate-500 font-bold ml-6 mt-1">Programa de Ingeniería de Sistemas y Computación</p>
      </header>

      <div className="flex flex-col gap-12">
        {semesters.map(sem => (
          <div key={sem} className="space-y-6">
            <h3 className="text-xl font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black">S{sem}</span>
              Semestre {sem}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {subjects.filter(s => s.semester === sem).map(s => {
                const isPassed = myHistory.some(h => h.subjectCode === s.code && h.status === EstadoInscripcion.COMPLETED);
                const isMissingPrereq = s.prerequisites.some(p => !myHistory.some(h => h.subjectCode === p && h.status === EstadoInscripcion.COMPLETED));
                
                return (
                  <div 
                    key={s.code} 
                    className={`p-5 rounded-2xl border-2 transition-all group ${isPassed ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/10' : isMissingPrereq ? 'bg-white border-slate-100 opacity-60' : 'bg-white border-white shadow-xl hover:border-emerald-200'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] font-black font-mono text-emerald-500 px-2 py-0.5 bg-emerald-50 rounded uppercase tracking-tighter">{s.code}</span>
                      {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <h4 className={`font-black text-sm uppercase italic leading-tight mb-3 ${isPassed ? 'text-emerald-700' : 'text-slate-800'}`}>{s.name}</h4>
                    <div className="space-y-2">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.credits} Créditos</p>
                       {s.prerequisites.length > 0 && (
                          <div className="pt-2 border-t border-slate-100">
                             <p className="text-[8px] text-slate-400 font-black uppercase mb-1">Prerrequisitos:</p>
                             <div className="flex flex-wrap gap-1">
                                {s.prerequisites.map(p => {
                                   const preSub = subjects.find(sub => sub.code === p);
                                   const prePassed = myHistory.some(h => h.subjectCode === p && h.status === EstadoInscripcion.COMPLETED);
                                   return (
                                     <span key={p} className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${prePassed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                        {preSub?.name || p}
                                     </span>
                                   );
                                })}
                             </div>
                          </div>
                       )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AdminStudentsViewProps {
  students: Estudiante[];
  refreshData: () => Promise<void>;
  showNotification: (type: any, msg: string) => void;
}

const AdminStudentsView = ({ students, refreshData, showNotification }: AdminStudentsViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Estudiante> | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
      setIsDeleting(id);
      const success = await StudentRepository.delete(id);
      if (success) {
        showNotification('success', 'Estudiante eliminado correctamente.');
        await refreshData();
      } else {
        showNotification('error', 'Error al eliminar estudiante.');
      }
      setIsDeleting(null);
    }
  };

  const filteredStudents = students.filter(s => 
    s.role !== 'admin' && (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 border-l-8 border-emerald-500 pl-6 uppercase italic">Gestión de Estudiantes</h2>
          <p className="text-slate-500 font-bold ml-6 mt-1">Administración Central de Usuarios</p>
        </div>
        <button 
          onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" /> Nuevo Estudiante
        </button>
      </header>

      <Card className="p-4 bg-white/50 backdrop-blur-md">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, ID o correo..." 
            className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-xl">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-slate-900 text-[10px] font-black text-white uppercase tracking-[0.2em]">
            <tr>
              <th className="p-8">Estudiante</th>
              <th className="p-8">ID / Créditos Max</th>
              <th className="p-8">Estado</th>
              <th className="p-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-sm">
                      {s.avatarUrl ? (
                        <img src={s.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={s.name} />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors uppercase italic text-sm">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                   <p className="text-xs font-black text-slate-700 font-mono tracking-widest">{s.id}</p>
                   <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Máx Credits: {s.maxCredits}</p>
                </td>
                <td className="p-8">
                  <Badge variant={s.status === EstadoEstudiante.ACTIVE ? 'success' : 'danger'}>{s.status}</Badge>
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setEditingStudent(s); setIsModalOpen(true); }}
                      className="p-3 bg-white text-emerald-400 hover:text-emerald-600 border border-slate-100 rounded-2xl hover:border-emerald-200 shadow-sm transition-all hover:scale-110"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      disabled={isDeleting === s.id}
                      className="p-3 bg-white text-rose-400 hover:text-rose-600 border border-slate-100 rounded-2xl hover:border-rose-200 shadow-sm transition-all hover:scale-110 disabled:opacity-50"
                    >
                      {isDeleting === s.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isModalOpen && (
        <StudentModal 
           student={editingStudent} 
           onClose={() => setIsModalOpen(false)} 
           refreshData={refreshData} 
           showNotification={showNotification} 
        />
      )}
    </div>
  );
};

interface StudentModalProps {
  student: Partial<Estudiante> | null;
  onClose: () => void;
  refreshData: () => Promise<void>;
  showNotification: (type: any, msg: string) => void;
}

const StudentModal = ({ student, onClose, refreshData, showNotification }: StudentModalProps) => {
  const [formData, setFormData] = useState<Partial<Estudiante>>(student || {
    id: '',
    name: '',
    email: '',
    status: EstadoEstudiante.ACTIVE,
    maxCredits: 22,
    avatarUrl: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let success = false;
    if (student) {
      success = await StudentRepository.update(student.id!, formData);
    } else {
      success = await EstudianteRepository.createAsAdmin(formData);
    }

    if (success) {
      showNotification('success', student ? 'Estudiante actualizado.' : 'Estudiante creado.');
      await refreshData();
      onClose();
    } else {
      showNotification('error', 'Error al procesar la solicitud.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[3rem] p-10 shadow-3xl"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-3xl font-black text-slate-800 uppercase italic leading-none">{student ? 'Editar' : 'Nuevo'} Estudiante</h3>
            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mt-1">Formulario de Registro Central</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">ID Universitario</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
                value={formData.id}
                onChange={e => setFormData({...formData, id: e.target.value})}
                disabled={!!student}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Créditos Máximos</label>
              <input 
                type="number" 
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
                value={formData.maxCredits}
                onChange={e => setFormData({...formData, maxCredits: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Nombre Completo</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Contraseña</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
              value={(formData as any).password || ''}
              onChange={e => setFormData({...formData, password: e.target.value} as any)}
              placeholder="Ej: matricula2024"
              required={!student}
            />
            <p className="text-[9px] text-slate-400 ml-1">Esta contraseña se enviará al correo del estudiante.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Estado Académico</label>
              <select 
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50 appearance-none cursor-pointer"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as EstadoEstudiante})}
              >
                <option value={EstadoEstudiante.ACTIVE}>ACTIVO</option>
                <option value={EstadoEstudiante.INACTIVE}>INACTIVO</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">URL Avatar</label>
              <input 
                type="url" 
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
                value={formData.avatarUrl}
                onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
             <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-xs tracking-widest hover:bg-slate-50"
             >
                Cancelar
             </button>
             <button 
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:brightness-110"
             >
                {loading ? 'Procesando...' : (student ? 'Guardar Cambios' : 'Crear Estudiante')}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

interface ProfileViewProps {
  student: Estudiante;
  setStudent: React.Dispatch<React.SetStateAction<Estudiante>>;
  showNotification: (type: any, message: string) => void;
}

const ProfileView = ({ student, setStudent, showNotification }: ProfileViewProps) => {
  const [editData, setEditData] = useState({
    name: student.name,
    email: student.email,
    avatarUrl: student.avatarUrl || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await StudentRepository.update(student.id, editData);
    if (success) {
      setStudent({ ...student, ...editData });
      showNotification('success', 'Perfil actualizado con éxito.');
    } else {
      showNotification('error', 'Error al actualizar el perfil.');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 border-l-8 border-emerald-500 pl-6 uppercase italic">Mi Perfil Universitario</h2>
        <p className="text-slate-500 font-bold ml-6 mt-1">Configuración de Identidad Digital</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 p-8 text-center flex flex-col items-center justify-center space-y-6">
          <div className="relative group">
            <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-emerald-500/20 shadow-2xl relative">
              {editData.avatarUrl ? (
                <img src={editData.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Avatar Preview" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User className="w-20 h-20" />
                </div>
              )}
              <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-600 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-none mb-2">{student.name}</h3>
            <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">{student.id}</p>
          </div>
          <div className="w-full pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
             <div className="p-3 bg-slate-50 rounded-2xl">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Semestre</p>
               <p className="text-lg font-black text-slate-800">{student.semester}°</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-2xl">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</p>
               <p className="text-xs font-black text-emerald-600">ACTIVO</p>
             </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-10">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Institucional</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
                  value={editData.email}
                  onChange={e => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL de Imagen de Perfil</label>
              <div className="relative">
                <Camera className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input 
                  type="url" 
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 bg-slate-50/50"
                  value={editData.avatarUrl}
                  onChange={e => setEditData({ ...editData, avatarUrl: e.target.value })}
                />
              </div>
              <p className="text-[9px] text-slate-400 font-medium ml-2">Pega el link de una imagen para actualizar tu avatar.</p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSaving}
                className={`flex items-center gap-2 px-10 py-5 rounded-2.5xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'green-gradient text-white shadow-emerald-500/20 hover:brightness-110'}`}
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </motion.button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

interface LoginViewProps {
  loginData: any;
  setLoginData: any;
  handleLogin: any;
}

const LoginView = ({ loginData, setLoginData, handleLogin }: LoginViewProps) => (
  <div className="min-h-screen flex items-center justify-center p-6 min-w-full overflow-hidden relative">
    <BackgroundBlobs />
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <img 
        src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop" 
        className="w-full h-full object-cover opacity-10 grayscale brightness-50 contrast-125" 
        referrerPolicy="no-referrer" 
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-slate-900/90 to-emerald-900/80" />
    </div>
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-md w-full relative z-10"
    >
      <div className="text-center mb-12">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-28 h-28 bg-emerald-600 rounded-[3rem] flex items-center justify-center text-white font-black text-6xl mx-auto mb-8 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.5)] border-4 border-emerald-400/20 relative"
        >
          A
          <div className="absolute -inset-2 bg-emerald-500/20 rounded-[3.5rem] animate-pulse blur-xl" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-6xl font-black text-white tracking-tighter mb-3 uppercase italic"
        >
          AcademiaSync
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-emerald-400 font-black uppercase tracking-[0.4em] text-xs"
        >
          Unidad Universitaria Digital
        </motion.p>
      </div>

      <Card className="p-10 shadow-3xl bg-white/10 backdrop-blur-3xl !border-white/20">
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-emerald-100 uppercase tracking-widest ml-2 opacity-70">Acceso Universitario (Email)</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-md group-focus-within:bg-emerald-500/20 transition-all" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 relative z-10" />
              <input 
                type="email" 
                placeholder="usuario@universidad.edu.co" 
                className="w-full pl-12 pr-4 py-5 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium text-white placeholder:text-emerald-100/30 relative z-10" 
                value={loginData.email} 
                onChange={e => setLoginData({...loginData, email: e.target.value})} 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-emerald-100 uppercase tracking-widest ml-2 opacity-70">Semestre</label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                className="w-full px-5 py-5 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium text-white placeholder:text-emerald-100/30" 
                value={loginData.semester} 
                onChange={e => setLoginData({...loginData, semester: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-emerald-100 uppercase tracking-widest ml-2 opacity-70">PIN de Seguridad</label>
              <input 
                type="password" 
                placeholder="••••" 
                className="w-full px-5 py-5 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium text-white placeholder:text-emerald-100/30" 
                value={loginData.password} 
                onChange={e => setLoginData({...loginData, password: e.target.value})} 
                required 
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full green-gradient text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] relative overflow-hidden group"
          >
             <span className="relative z-10 flex items-center justify-center gap-3">
               INGRESAR AL SISTEMA <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </span>
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </motion.button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
           <p className="text-[9px] text-emerald-100/40 font-black uppercase tracking-widest leading-loose">
             ENTORNO DE PRUEBAS<br />
             <span className="text-emerald-400">juan.perez@univirtual.edu.co</span> • <span className="text-emerald-400">maria.garcia@univirtual.edu.co</span> • <span className="text-emerald-400">admin@univirtual.edu.co</span>
           </p>
        </div>
      </Card>
    </motion.div>
  </div>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  studentsList: Estudiante[];
  student: Estudiante;
  setStudent: (s: Estudiante) => void;
  showNotification: (type: any, msg: string) => void;
  setIsAuthenticated: (val: boolean) => void;
  messages: MensajeSoporte[];
}

const Sidebar = ({ activeTab, setActiveTab, studentsList, student, setStudent, showNotification, setIsAuthenticated, messages }: SidebarProps) => (
  <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-40 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
      <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
    </div>
    <div className="p-6 text-center relative z-10">
      <div className="flex items-center gap-3 mb-8 justify-center">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl">A</div>
        <span className="text-xl font-bold text-white tracking-tight uppercase">AcademiaSync</span>
      </div>
      <nav className="space-y-1">
        {[
          { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Resumen', show: true },
          { id: 'admin-students', icon: <User className="w-5 h-5" />, label: 'Gestión Estudiantes', show: student.role === 'admin' },
          { id: 'curriculum', icon: <Layers className="w-5 h-5" />, label: 'Plan de Estudios', show: student.role === 'student' },
          { id: 'enroll', icon: <BookOpen className="w-5 h-5" />, label: 'Inscribir', show: student.role === 'student' },
          { id: 'my-subjects', icon: <RefreshCw className="w-5 h-5" />, label: 'Gestionar', show: student.role === 'student' },
          { id: 'schedule', icon: <Calendar className="w-5 h-5" />, label: 'Horario', show: student.role === 'student' },
          { id: 'history', icon: <History className="w-5 h-5" />, label: 'Historial', show: student.role === 'student' },
          { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Mi Perfil', show: true },
          { id: 'support', icon: <div className="relative"><MessagesSquare className="w-5 h-5" />{messages.filter(m => m.receiverId === 'admin' && !m.read).length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>}</div>, label: 'Centro Soporte', show: student.role === 'admin' },
          { id: 'admin-notifs', icon: <Bell className="w-5 h-5" />, label: 'Gestión Push', show: student.role === 'admin' },
        ].filter(item => item.show).map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-800/50'}`}
          >
            {item.icon} <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
    <div className="mt-auto p-6 border-t border-slate-800 relative z-10">
      <button 
        onClick={() => setActiveTab('profile')}
        className={`w-full flex items-center gap-3 mb-4 p-2 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-emerald-600/20 ring-1 ring-emerald-500/50' : 'bg-slate-800/40 hover:bg-slate-800/60'}`}
      >
        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20 overflow-hidden">
          {student.avatarUrl ? (
            <img src={student.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        <div className="overflow-hidden text-left">
          <p className="text-sm font-bold text-white truncate">{student.name}</p>
          <p className="text-[10px] text-slate-500 truncate font-mono">{student.id}</p>
        </div>
      </button>
      <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-rose-400 transition-colors font-medium"><LogOut className="w-4 h-4" /> Salir</button>
    </div>
  </div>
);

interface DashboardProps {
  student: Estudiante;
  enrollments: Inscripcion[];
  subjects: Asignatura[];
  allHistory: HistorialAcademico[];
  setActiveTab: (tab: any) => void;
}

const Dashboard = ({ student, enrollments, subjects, allHistory, setActiveTab }: DashboardProps) => {
  const myEnrollments = enrollments.filter(e => e.studentId === student.id);
  const credits = myEnrollments.reduce((sum, e) => sum + (subjects.find(s => s.code === e.subjectCode)?.credits || 0), 0);
  const myHistory = allHistory.filter(h => h.studentId === student.id);
  const gpa = myHistory.length ? (myHistory.reduce((sum, h) => sum + h.grade, 0) / myHistory.length).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 green-gradient opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-emerald-500/20 overflow-hidden border-2 border-white/50">
             {student.avatarUrl ? (
               <img src={student.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             ) : (
               student.name[0]
             )}
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              Bienvenido, <span className="text-emerald-600">{student.name.split(' ')[0]}</span>
            </h2>
            <p className="text-slate-500 font-medium mt-1">Gestión Académica Uniquindio v2.0</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2 relative z-10">
           <Badge variant={student.status === EstadoEstudiante.ACTIVE ? 'success' : 'danger'}>{student.status}</Badge>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">ID: {student.id}</p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6" delay={0.1}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Créditos Inscritos</p>
          <p className="text-3xl font-black text-slate-800">{credits} <span className="text-sm text-slate-400 font-normal">/ {student.maxCredits}</span></p>
          <div className="mt-4 w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(credits/student.maxCredits)*100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="green-gradient h-2 rounded-full shadow-lg shadow-emerald-500/20" 
            />
          </div>
        </Card>
        <Card className="p-6" delay={0.3}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">PGA (Promedio)</p>
          <p className="text-3xl font-black text-emerald-600">{gpa}</p>
          <div className="flex gap-1 mt-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= Math.floor(parseFloat(gpa)) ? 'bg-emerald-500' : 'bg-emerald-100'}`} />
            ))}
          </div>
        </Card>
        <Card className="p-6 green-gradient text-white !border-none" delay={0.4}>
          <p className="text-[10px] font-black text-white/60 uppercase mb-3 tracking-widest">Atención</p>
          <p className="text-sm font-bold leading-tight">Proceso de matrícula habilitado hasta el 20 de mayo.</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 p-8">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Inscripciones Activas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {myEnrollments.map(e => {
                  const s = subjects.find(sub => sub.code === e.subjectCode);
                  return (
                    <div key={e.id} className="group p-4 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl border border-emerald-100/50 transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{s?.name}</p>
                             <div className="flex items-center gap-2">
                                <p className="text-[10px] text-emerald-500 font-mono font-bold">{e.subjectCode}</p>
                                <span className="text-[8px] px-1.5 py-0.5 bg-emerald-100/50 text-emerald-700 rounded-md font-black uppercase tracking-tighter">SEM {s?.semester}</span>
                             </div>
                          </div>
                          <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm border border-emerald-100">
                             < BookOpen className="w-4 h-4" />
                          </div>
                       </div>
                       <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {s?.schedule}
                       </p>
                    </div>
                  );
               })}
               {!myEnrollments.length && <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 uppercase text-[10px] font-bold tracking-widest">No hay materias inscritas.</div>}
            </div>
         </Card>
         <div className="space-y-6">
            <Card className="p-8 bg-emerald-900 text-white !border-none relative overflow-hidden group">
               <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-5 rounded-full scale-150 blur-2xl group-hover:scale-110 transition-transform duration-700" />
               <h4 className="font-black text-emerald-400 text-[10px] uppercase tracking-widest mb-4">Información</h4>
               <p className="text-sm font-medium leading-relaxed mb-6">Este sistema utiliza persistencia real en archivos CSV. Tus cambios se guardan automáticamente en el servidor.</p>
               <button onClick={() => setActiveTab('enroll')} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-xs transition-all shadow-lg shadow-black/20">IR A MATRICULAR</button>
            </Card>
            <Card className="p-6 border-l-4 border-amber-500/50 bg-amber-50/30">
               <h4 className="font-black text-amber-800 text-[10px] uppercase tracking-widest mb-1">Reprogramación</h4>
               <p className="text-xs text-amber-700 leading-snug">Solicitud de cambios de horario permitida bajo validación de cupo.</p>
            </Card>
         </div>
      </div>
    </div>
  );
};

interface ScheduleViewProps {
  student: Estudiante;
  enrollments: Inscripcion[];
  subjects: Asignatura[];
}

const ScheduleView = ({ student, enrollments, subjects }: ScheduleViewProps) => {
  // ... (keep existing)
};

interface AdminSupportViewProps {
  messages: MensajeSoporte[];
  students: Estudiante[];
  selectedStudent: string | null;
  setSelectedStudent: (id: string | null) => void;
  onReply: (studentId: string) => void;
  newMessage: string;
  setNewMessage: (msg: string) => void;
  onMarkAsRead: (senderId: string) => Promise<void>;
}

const NotificationCenter = ({ notifications, studentId, onClose }: { notifications: Notificacion[]; studentId: string; onClose: () => void }) => {
  const filtered = notifications.filter(n => n.studentId === 'ALL' || n.studentId === studentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const getIcon = (type: TipoNotificacion) => {
    switch(type) {
      case TipoNotificacion.DEADLINE: return <Clock className="text-red-500" size={16} />;
      case TipoNotificacion.GRADE: return <PieChart className="text-emerald-500" size={16} />;
      case TipoNotificacion.REMINDER: return <BellRing className="text-amber-500" size={16} />;
      default: return <Megaphone className="text-blue-500" size={16} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="absolute top-20 right-8 w-96 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] z-[110] border border-white/50 overflow-hidden flex flex-col max-h-[600px]"
    >
      <header className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] italic">Notificaciones Académicas</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={16}/></button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BellRing size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Sin novedades por ahora</p>
          </div>
        ) : (
          filtered.map(n => (
            <div key={n.id} className={`p-5 rounded-3xl border transition-all ${n.read ? 'bg-slate-50/50 border-slate-100' : 'bg-emerald-50/50 border-emerald-100 ring-1 ring-emerald-200'}`}>
              <div className="flex gap-4">
                <div className="mt-1">{getIcon(n.type)}</div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{n.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{n.content}</p>
                  <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-wider">{new Date(n.date).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <footer className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button 
          onClick={async () => {
            await NotificationRepository.markAsRead(undefined, studentId);
            onClose();
          }}
          className="w-full py-3 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-[0.2em] transition-colors"
        >
          Marcar todo como leído
        </button>
      </footer>
    </motion.div>
  );
};

const AdminPushForm = ({ students, onPush }: { students: Estudiante[]; onPush: (n: Partial<Notificacion>) => Promise<void> }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: TipoNotificacion.INFO,
    studentId: 'ALL'
  });

  return (
    <Card className="p-8">
      <h3 className="text-xl font-black text-slate-900 border-l-4 border-emerald-500 pl-4 mb-8 uppercase italic">Emitir Notificación Push</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Título</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Ej: Recordatorio Entrega"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tipo</label>
            <select 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as TipoNotificacion})}
            >
              <option value={TipoNotificacion.INFO}>Información General</option>
              <option value={TipoNotificacion.DEADLINE}>Fecha Límite</option>
              <option value={TipoNotificacion.GRADE}>Calificación</option>
              <option value={TipoNotificacion.REMINDER}>Recordatorio</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Contenido del Mensaje</label>
          <textarea 
            rows={3} 
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" 
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            placeholder="Escribe el mensaje que llegará como notificación push..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Destinatario</label>
          <select 
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
            value={formData.studentId}
            onChange={e => setFormData({...formData, studentId: e.target.value})}
          >
            <option value="ALL">Todo el Campus (Global)</option>
            {students.filter(s => s.role === 'student').map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => {
            onPush(formData);
            setFormData({ title: '', content: '', type: TipoNotificacion.INFO, studentId: 'ALL' });
          }}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
        >
          <Bell size={18} /> Enviar Notificación Instantánea
        </button>
      </div>
    </Card>
  );
};

const AdminSupportView = ({ messages, students, selectedStudent, setSelectedStudent, onReply, newMessage, setNewMessage, onMarkAsRead }: AdminSupportViewProps) => {
  const studentChats = Array.from(new Set(messages.filter(m => m.senderId !== 'admin').map(m => m.senderId)));
  
  useEffect(() => {
    if (selectedStudent) {
      onMarkAsRead(selectedStudent);
    }
  }, [selectedStudent, messages.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
      <Card className="lg:col-span-1 p-6 overflow-y-auto">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 pb-4 border-b border-slate-100">Estudiantes</h3>
        <div className="space-y-4">
          {studentChats.map(sid => {
            const s = students.find(st => st.id === sid);
            const unread = messages.filter(m => m.senderId === sid && m.receiverId === 'admin' && !m.read).length;
            return (
              <button 
                key={sid}
                onClick={() => setSelectedStudent(sid)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedStudent === sid ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{s?.name || sid}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{sid}</p>
                  </div>
                  {unread > 0 && <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">{unread}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </Card>
      
      <Card className="lg:col-span-3 p-0 flex flex-col overflow-hidden bg-white/40 backdrop-blur-xl">
        {selectedStudent ? (
          <>
            <header className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">Conversación con {students.find(s => s.id === selectedStudent)?.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedStudent}</p>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.filter(m => m.senderId === selectedStudent || m.receiverId === selectedStudent).map(m => (
                <div key={m.id} className={`flex flex-col ${m.senderId === 'admin' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${m.senderId === 'admin' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                    {m.content}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-2 font-bold px-4">{new Date(m.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-white border-t border-slate-100">
               <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Escribe tu respuesta aquí..." 
                    className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && onReply(selectedStudent)}
                  />
                  <button 
                    onClick={() => onReply(selectedStudent)}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                  >
                    <Send size={16} /> Enviar
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
               <MessagesSquare className="w-12 h-12 text-emerald-500 opacity-20" />
            </div>
            <h3 className="font-black text-2xl text-slate-300 uppercase italic">Centro de Soporte Académico</h3>
            <p className="text-slate-400 mt-2 font-medium">Selecciona un estudiante para gestionar su consulta.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'enroll' | 'my-subjects' | 'history' | 'schedule' | 'profile' | 'curriculum' | 'admin-students' | 'admin-notifs' | 'support'>('dashboard');
  const [student, setStudent] = useState<Estudiante>({ id: 'GUEST', name: 'Invitado', email: '', status: EstadoEstudiante.INACTIVE, maxCredits: 0 });
  const [studentsList, setStudentsList] = useState<Estudiante[]>([]);
  const [subjects, setSubjects] = useState<Asignatura[]>([]);
  const [enrollments, setEnrollments] = useState<Inscripcion[]>([]);
  const [allHistory, setAllHistory] = useState<HistorialAcademico[]>([]);
  const [notification, setNotification] = useState<AlertProps | null>(null);
  const [reprogramConfirm, setReprogramConfirm] = useState<{ isOpen: boolean; enrollmentId: string | null; subjectName: string }>({ isOpen: false, enrollmentId: null, subjectName: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollmentSearch, setEnrollmentSearch] = useState('');
  const [semesterSearch, setSemesterSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [messages, setMessages] = useState<MensajeSoporte[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedStudentChat, setSelectedStudentChat] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
    loadNotifications();
    const interval = setInterval(() => {
      loadMessages();
      loadNotifications();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    const msgs = await MessageRepository.getAll();
    setMessages(msgs);
  };

  const loadNotifications = async () => {
    const notifs = await NotificationRepository.getAll();
    setNotifications(notifs);
  };

  const showNotification = (type: any, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchData = async () => {
    try {
      console.log("Iniciando sincronización de datos...");
      const data = await CsvManager.fetchAllData();
      
      setStudentsList(data.students || []);
      setSubjects(data.subjects || []);
      setEnrollments(data.enrollments || []);
      setAllHistory(data.history || []);
      
      if (isAuthenticated && student.id !== 'GUEST') {
        const updated = (data.students as Estudiante[]).find(s => s.id === student.id);
        if (updated) {
          setStudent(prev => ({ ...updated, semester: prev.semester }));
        }
      }
    } catch (err) {
      console.error("Error fetchData:", err);
      showNotification('error', 'Error al sincronizar con el núcleo universitario.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, student.id]);

  const { loginData, setLoginData, handleLogin } = useLoginController(studentsList, (s) => {
    setStudent(s);
    setIsAuthenticated(true);
  }, showNotification);

  const { enroll, cancel, updateEnrollment, reprogramar } = useInscripcionController(student, subjects, enrollments, allHistory, fetchData, showNotification);

  const handleSendMessage = async (receiverId: string = 'admin') => {
    if (!newMessage.trim() || student.id === 'GUEST') return;
    
    await MessageRepository.sendMessage({
      senderId: student.id,
      senderName: student.name,
      receiverId,
      content: newMessage,
    });
    setNewMessage('');
    loadMessages();
  };

  const handleAdminReply = async (studentId: string) => {
    if (!newMessage.trim() || student.role !== 'admin') return;
    
    await MessageRepository.sendMessage({
      senderId: 'admin',
      senderName: 'Soporte Académico',
      receiverId: studentId,
      content: newMessage,
    });
    setNewMessage('');
    loadMessages();
  };

  const handlePushNotification = async (notif: Partial<Notificacion>) => {
    await NotificationRepository.push(notif);
    loadNotifications();
    showNotification('success', 'Notificación Push enviada con éxito');
  };

  const toggleEnrollmentStatus = async (e: Inscripcion) => {
    const newStatus = e.status === EstadoInscripcion.ENROLLED ? EstadoInscripcion.COMPLETED : EstadoInscripcion.ENROLLED;
    await updateEnrollment(e.id, { status: newStatus });
  };

  // --- Views ---

     // Removed local definition

     // Removed local definition

     // Removed local definition

     // Removed local definition

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-emerald-950 text-emerald-400 font-black text-xl animate-pulse uppercase tracking-[0.3em] italic">Iniciando Núcleo de Matrícula...</div>;

  return (
    <div className="flex bg-[#f8fafc] min-h-screen relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      <BackgroundBlobs />
      {!isAuthenticated ? (
        <LoginView loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} />
      ) : (
        <>
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            studentsList={studentsList} 
            student={student} 
            setStudent={setStudent} 
            showNotification={showNotification} 
            setIsAuthenticated={setIsAuthenticated} 
            messages={messages}
          />
          <main className="ml-64 p-8 lg:p-16 w-full relative z-10">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-7xl mx-auto"
              >
                 {activeTab === 'dashboard' && <Dashboard student={student} enrollments={enrollments} subjects={subjects} allHistory={allHistory} setActiveTab={setActiveTab} />}
                 {activeTab === 'admin-students' && <AdminStudentsView students={studentsList} refreshData={fetchData} showNotification={showNotification} />}
                 {activeTab === 'curriculum' && <CurriculumView subjects={subjects} allHistory={allHistory} student={student} />}
                 {activeTab === 'profile' && <ProfileView student={student} setStudent={setStudent} showNotification={showNotification} />}
                 {activeTab === 'admin-notifs' && student.role === 'admin' && <AdminPushForm students={studentsList} onPush={handlePushNotification} />}
                 {activeTab === 'support' && student.role === 'admin' && (
                   <div className="space-y-6">
                     <h2 className="text-3xl font-black tracking-tight text-slate-900 border-l-8 border-emerald-500 pl-6 uppercase italic">Centro de Respuestas</h2>
                     <AdminSupportView 
                       messages={messages} 
                       students={studentsList} 
                       selectedStudent={selectedStudentChat}
                       setSelectedStudent={setSelectedStudentChat}
                       onReply={handleAdminReply}
                       newMessage={newMessage}
                       setNewMessage={setNewMessage}
                       onMarkAsRead={MessageRepository.markAsRead}
                     />
                   </div>
                 )}
                 {activeTab === 'enroll' && (
                   <div className="space-y-6">
                     <header className="flex justify-between items-end mb-8 relative">
                        <div>
                          <h2 className="text-4xl font-black tracking-tight text-slate-900 border-l-8 border-emerald-500 pl-6 uppercase italic">Oferta Académica</h2>
                          <p className="text-slate-500 font-bold ml-6 mt-1">Nuevos Espacios para el Semestre {student.semester + 1}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-emerald-500 shadow-xl">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cupos de Crédito:</span>
                           <span className="text-xl font-black text-emerald-600">{enrollments.filter(e => e.studentId === student.id).reduce((sum, e) => sum + (subjects.find(s => s.code === e.subjectCode)?.credits || 0), 0)} / {student.maxCredits}</span>
                        </div>
                     </header>
                     <div className="relative group max-w-2xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 group-focus-within:scale-110 transition-transform" />
                        <input type="text" placeholder="Buscar por nombre o código de asignatura..." className="w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 border-transparent bg-white shadow-xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" onChange={searchTermInput => setSearchTerm(searchTermInput.target.value)} />
                     </div>
                     <div className="flex justify-end mb-6">
                        <div className="relative group w-full md:w-64">
                           <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
                           <select 
                             className="w-full pl-12 pr-10 py-5 rounded-3xl border-2 border-transparent bg-white shadow-xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                             value={semesterSearch}
                             onChange={e => setSemesterSearch(e.target.value)}
                           >
                             <option value="">Filtrar por Semestre</option>
                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sem => (
                               <option key={sem} value={sem.toString()}>Semestre {sem}</option>
                             ))}
                           </select>
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400">
                             <ChevronRight className="w-4 h-4 rotate-90" />
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {subjects.filter(s => (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())) && (semesterSearch === '' || s.semester.toString() === semesterSearch)).map((s, idx) => (
                         <Card key={s.code} delay={idx * 0.05} className="p-8 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden bg-white/90">
                            <div className="absolute top-0 right-0 w-24 h-24 green-gradient opacity-10 rounded-full translate-x-12 -translate-y-12 blur-2xl group-hover:scale-150 transition-transform" />
                            <div>
                              <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 mb-4 uppercase tracking-[0.2em] relative z-10">
                                 <div className="flex gap-2">
                                   <span className="px-3 py-1 bg-emerald-100 rounded-lg">{s.code}</span> 
                                   <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg font-black uppercase tracking-widest leading-none flex items-center">Sem {s.semester}</span>
                                 </div> 
                                 <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin-slow" /> {s.credits} CRÉDITOS</span>
                              </div>
                              <h4 className="font-black text-slate-900 text-2xl mb-2 leading-tight relative z-10">{s.name}</h4>
                              <div className="space-y-4 mb-6">
                                <p className="text-xs text-slate-400 font-bold flex items-center gap-2 uppercase tracking-wide"><Calendar className="w-4 h-4 text-emerald-500" /> {s.schedule}</p>
                                {s.prerequisites.length > 0 && (
                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Info className="w-3 h-3" /> Requisitos necesarios:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {s.prerequisites.map(p => {
                                        const isPassed = allHistory.some(h => h.studentId === student.id && h.subjectCode === p && h.status === EstadoInscripcion.COMPLETED);
                                        return (
                                          <span key={p} className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {subjects.find(sub => sub.code === p)?.name || p}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between items-center mb-8">
                                 <Badge variant={s.enrolledCount >= s.capacity ? 'danger' : 'success'}>{s.enrolledCount >= s.capacity ? 'AGOTADO' : `${s.enrolledCount}/${s.capacity} CUPO DISPONIBLE`}</Badge>
                              </div>
                            </div>
                            <button 
                             onClick={() => enroll(s)} 
                              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all relative z-10 ${
                                s.enrolledCount >= s.capacity || 
                                enrollments.some(e => e.studentId === student.id && e.subjectCode === s.code && e.status !== EstadoInscripcion.REPROGRAMADA) ||
                                s.prerequisites.some(p => !allHistory.some(h => h.studentId === student.id && h.subjectCode === p && h.status === EstadoInscripcion.COMPLETED))
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                : 'green-gradient text-white hover:brightness-110 shadow-xl shadow-emerald-500/20 active:scale-95'
                              }`}
                              disabled={
                                s.enrolledCount >= s.capacity || 
                                enrollments.some(e => e.studentId === student.id && e.subjectCode === s.code && e.status !== EstadoInscripcion.REPROGRAMADA) ||
                                s.prerequisites.some(p => !allHistory.some(h => h.studentId === student.id && h.subjectCode === p && h.status === EstadoInscripcion.COMPLETED))
                              }
                            >
                              {s.enrolledCount >= s.capacity ? <X className="w-4 h-4" /> : 
                               s.prerequisites.some(p => !allHistory.some(h => h.studentId === student.id && h.subjectCode === p && h.status === EstadoInscripcion.COMPLETED)) ? <AlertCircle className="w-4 h-4" /> :
                               enrollments.some(e => e.studentId === student.id && e.subjectCode === s.code) ? (
                                enrollments.find(e => e.studentId === student.id && e.subjectCode === s.code)?.status === EstadoInscripcion.REPROGRAMADA ? <RefreshCw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />
                              ) : <Plus className="w-4 h-4" />}
                              {
                                s.enrolledCount >= s.capacity ? 'Agotado' :
                                s.prerequisites.some(p => !allHistory.some(h => h.studentId === student.id && h.subjectCode === p && h.status === EstadoInscripcion.COMPLETED)) ? 'Bloqueado' :
                                enrollments.some(e => e.studentId === student.id && e.subjectCode === s.code) ? (
                                  enrollments.find(e => e.studentId === student.id && e.subjectCode === s.code)?.status === EstadoInscripcion.REPROGRAMADA ? 'Reprogramada' : 'Inscrito'
                                ) : 'Matricular'
                              }
                            </button>
                         </Card>
                       ))}
                     </div>
                   </div>
                 )}
                 {activeTab === 'my-subjects' && (
                   <div className="space-y-6">
                     <div className="flex justify-between items-end mb-8 relative">
                        <div>
                          <h2 className="text-3xl font-black tracking-tight text-slate-900 border-l-8 border-emerald-500 pl-6 uppercase italic">Gestión Académica</h2>
                          <p className="text-slate-500 font-bold ml-6 mt-1">Control total de tus asignaturas inscritas</p>
                        </div>
                        <div className="relative group max-w-xs w-full">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                           <input 
                             type="text" 
                             placeholder="Buscar por código..." 
                             className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-bold text-xs" 
                             value={enrollmentSearch}
                             onChange={e => setEnrollmentSearch(e.target.value)}
                           />
                        </div>
                     </div>
                     <Card className="rounded-[2rem] overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-xl">
                        <table className="w-full text-left border-separate border-spacing-0">
                           <thead className="bg-emerald-600 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                              <tr><th className="p-8">Asignatura</th><th className="p-8">Carga</th><th className="p-8">Estado</th><th className="p-8">Horario</th><th className="p-8 text-right">Acciones</th></tr>
                           </thead>
                           <tbody className="divide-y divide-emerald-50">
                              {enrollments.filter(e => e.studentId === student.id && (e.id.toLowerCase().includes(enrollmentSearch.toLowerCase()) || e.subjectCode.toLowerCase().includes(enrollmentSearch.toLowerCase()))).map(e => {
                                 const s = subjects.find(sub => sub.code === e.subjectCode);
                                 return (
                                   <tr key={e.id} className="hover:bg-emerald-50/50 transition-colors group">
                                      <td className="p-8">
                                         <p className="font-black text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors uppercase italic text-sm">{s?.name}</p>
                                         <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[10px] text-emerald-500 font-black font-mono tracking-widest leading-none">{e.id}</p>
                                            <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-black uppercase">SEM {s?.semester}</span>
                                         </div>
                                      </td>
                                      <td className="p-8">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                          {s?.credits} Créditos
                                        </div>
                                      </td>
                                      <td className="p-8">
                                        <Badge 
                                          variant={
                                            e.status === EstadoInscripcion.ENROLLED ? 'primary' : 
                                            e.status === EstadoInscripcion.REPROGRAMADA ? 'warning' : 
                                            'success'
                                          }
                                        >
                                          {e.status}
                                        </Badge>
                                      </td>
                                      <td className="p-8 text-xs text-slate-500 font-bold uppercase">{s?.schedule}</td>
                                      <td className="p-8 text-right">
                                         <div className="flex justify-end gap-3">
                                            {e.status === EstadoInscripcion.ENROLLED && (
                                               <button 
                                                 onClick={() => setReprogramConfirm({ isOpen: true, enrollmentId: e.id, subjectName: s?.name || '' })} 
                                                 className="p-3 bg-white text-amber-500 hover:text-amber-700 border border-slate-100 rounded-2xl hover:border-amber-200 shadow-sm transition-all hover:scale-110" 
                                                 title="Reprogramar materia para otro semestre"
                                               >
                                                 <Calendar className="w-4 h-4" />
                                               </button>
                                             )}
                                            <button onClick={() => toggleEnrollmentStatus(e)} className="p-3 bg-white text-emerald-400 hover:text-emerald-600 border border-slate-100 rounded-2xl hover:border-emerald-200 shadow-sm transition-all hover:scale-110" title="Cambiar Estado (Actualizar)"><RefreshCw className="w-4 h-4" /></button>
                                            <button onClick={() => cancel(e.id)} className="p-3 bg-white text-slate-400 hover:text-rose-600 border border-slate-100 rounded-2xl hover:border-rose-200 shadow-sm transition-all hover:scale-110" title="Eliminar Inscripción"><Trash2 className="w-4 h-4" /></button>
                                         </div>
                                      </td>
                                   </tr>
                                 );
                              })}
                              {!enrollments.filter(e => e.studentId === student.id).length && <tr><td colSpan={5} className="p-24 text-center text-slate-400 bg-white"><div className="mb-4"><LogOut className="w-12 h-12 mx-auto text-emerald-100" /></div><p className="font-black uppercase tracking-widest text-xs opacity-40">No se detectan inscripciones activas.</p></td></tr>}
                           </tbody>
                        </table>
                     </Card>
                     <div className="p-8 bg-black text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 green-gradient opacity-20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
                        <div className="flex gap-6 items-start relative z-10">
                          <div className="p-4 bg-emerald-600 rounded-2xl"><AlertCircle className="w-8 h-8 text-white" /></div>
                          <div className="text-sm leading-relaxed max-w-2xl">
                             <p className="font-black text-emerald-400 mb-2 uppercase tracking-widest text-lg italic">Políticas de Cancelación (RN-003)</p>
                             <p className="text-slate-300 font-medium">Recuerda que tienes hasta la fecha límite establecida en el calendario académico para cancelar asignaturas sin recargo en tu historia de créditos. Cualquier cambio fuera de fecha requiere autorización de decanatura.</p>
                          </div>
                        </div>
                     </div>
                   </div>
                 )}
                 {activeTab === 'history' && (
                   <div className="space-y-6">
                     <h2 className="text-3xl font-black tracking-tight text-slate-900 border-l-8 border-emerald-500 pl-6 uppercase italic">Registro Histórico</h2>
                     <Card className="rounded-[2rem] divide-y divide-emerald-50 border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                        {allHistory.filter(h => h.studentId === student.id).length > 0 ? allHistory.filter(h => h.studentId === student.id).map((h, i) => (
                          <div key={i} className="p-8 flex justify-between items-center hover:bg-emerald-50/50 transition-colors group">
                             <div className="flex gap-6 items-center">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl transition-transform group-hover:rotate-6 ${h.status === EstadoInscripcion.COMPLETED && h.grade >= 3 ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-rose-600 text-white shadow-rose-500/30'}`}>{h.grade.toFixed(1)}</div>
                                <div>
                                   <p className="font-black text-slate-900 text-xl uppercase italic group-hover:text-emerald-700 transition-colors">{subjects.find(s => s.code === h.subjectCode)?.name || h.subjectCode}</p>
                                   <p className="text-[10px] text-emerald-600 font-black font-mono tracking-[0.2em]">{h.subjectCode}</p>
                                    <span className="text-[8px] px-1.5 py-0.5 mt-1 block w-fit bg-slate-100 text-slate-500 rounded font-black uppercase">Sem {subjects.find(sub => sub.code === h.subjectCode)?.semester}</span>
                                </div>
                             </div>
                             <div className="text-right">
                               <Badge variant={h.status === EstadoInscripcion.COMPLETED ? 'success' : 'danger'}>{h.status}</Badge>
                             </div>
                          </div>
                        )) : (
                          <div className="p-32 text-center text-slate-300"><History className="w-16 h-16 mx-auto mb-4 opacity-10" /><p className="font-black uppercase tracking-widest text-xs opacity-40">Expediente académico vacío.</p></div>
                        )}
                     </Card>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <Card className="p-8 bg-emerald-600 text-white border-none shadow-2xl shadow-emerald-500/30 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform" />
                           <h4 className="font-black text-emerald-200 text-xs mb-3 uppercase tracking-[0.3em]">Total Aprobadas</h4>
                           <p className="text-6xl font-black italic">{allHistory.filter(h => h.studentId === student.id && h.status === EstadoInscripcion.COMPLETED).length}</p>
                        </Card>
                        <Card className="p-8 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 green-gradient opacity-20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform" />
                           <h4 className="font-black text-emerald-400 text-xs mb-3 uppercase tracking-[0.3em]">Créditos Acumulados</h4>
                           <p className="text-6xl font-black italic">{allHistory.filter(h => h.studentId === student.id && h.status === EstadoInscripcion.COMPLETED).reduce((sum, h) => sum + (subjects.find(s => s.code === h.subjectCode)?.credits || 0), 0)}</p>
                        </Card>
                     </div>
                   </div>
                 )}
                 {activeTab === 'schedule' && <ScheduleView student={student} enrollments={enrollments} subjects={subjects} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}
      {/* Floating Chat for Students */}
      {isAuthenticated && (
        <div className="fixed top-8 right-8 z-[120] flex gap-4">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-14 h-14 bg-white text-slate-800 rounded-2xl shadow-xl flex items-center justify-center hover:bg-emerald-50 transition-all border border-slate-100 relative group"
          >
            <Bell className="w-6 h-6 group-hover:text-emerald-600 transition-colors" />
            {notifications.filter(n => (n.studentId === 'ALL' || n.studentId === student.id) && !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {notifications.filter(n => (n.studentId === 'ALL' || n.studentId === student.id) && !n.read).length}
              </span>
            )}
          </button>
          <AnimatePresence>
             {isNotificationsOpen && <NotificationCenter notifications={notifications} studentId={student.id} onClose={() => setIsNotificationsOpen(false)} />}
          </AnimatePresence>
        </div>
      )}
      {isAuthenticated && student.role === 'student' && (
        <>
          <div className="fixed bottom-8 right-8 z-[100]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSupportOpen(!isSupportOpen)}
              className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:bg-emerald-500 transition-all border-4 border-white relative"
            >
              {isSupportOpen ? <X size={28} /> : <MessagesSquare size={28} />}
              {!isSupportOpen && messages.filter(m => m.receiverId === student.id && !m.read).length > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-[11px] font-black rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                  {messages.filter(m => m.receiverId === student.id && !m.read).length}
                </span>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {isSupportOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="fixed bottom-28 right-8 w-96 h-[550px] bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] z-[100] border border-slate-100 flex flex-col overflow-hidden"
              >
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MessagesSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-wider">Soporte Académico</h3>
                      <p className="text-[10px] text-emerald-100 font-bold uppercase opacity-70">En línea • Tiempo resp. 5min</p>
                    </div>
                  </div>
                  <button onClick={() => setIsSupportOpen(false)} className="opacity-70 hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                  {messages.filter(m => m.senderId === student.id || m.receiverId === student.id).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-6 border border-emerald-50">
                        <MessageCircle size={32} className="text-emerald-500" />
                      </div>
                      <h4 className="font-black text-slate-800 uppercase italic">¿Hola, en qué podemos ayudarte?</h4>
                      <p className="text-[11px] text-slate-400 mt-2 font-medium max-w-[200px] mx-auto">Nuestro equipo de administración responderá tus dudas sobre el registro académico.</p>
                    </div>
                  ) : (
                    messages
                      .filter(m => m.senderId === student.id || m.receiverId === student.id)
                      .map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.senderId === student.id ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12px] font-medium leading-relaxed shadow-sm ${
                            msg.senderId === student.id 
                              ? 'bg-emerald-600 text-white rounded-tr-none' 
                              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-[9px] text-slate-400 mt-1.5 font-bold px-2 uppercase opacity-60">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                  )}
                </div>

                <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.05)]">
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Escribe tu duda universitaria..."
                      className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('admin')}
                    />
                    <button 
                      onClick={() => handleSendMessage('admin')}
                      className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <AnimatePresence>
        {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {reprogramConfirm.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-3xl text-center"
            >
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-4">¿Confirmar Reprogramación?</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                ¿Realmente confirmas tu decisión de ver la materia <span className="text-amber-600 font-bold">"{reprogramConfirm.subjectName}"</span> en otro semestre? 
                Esta acción marcará la materia como pospuesta en tu registro actual.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setReprogramConfirm({ ...reprogramConfirm, isOpen: false })}
                  className="py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={async () => {
                    if (reprogramConfirm.enrollmentId) {
                      await reprogramar(reprogramConfirm.enrollmentId);
                      setReprogramConfirm({ ...reprogramConfirm, isOpen: false });
                    }
                  }}
                  className="py-4 rounded-2xl bg-amber-500 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
