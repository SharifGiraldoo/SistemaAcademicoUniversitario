export interface Asignatura {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  capacity: number;
  enrolledCount: number;
  schedule: string;
  prerequisites: string[];
  description?: string;
}
