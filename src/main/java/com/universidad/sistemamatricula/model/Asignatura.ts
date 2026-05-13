export interface Asignatura {
  code: string;
  name: string;
  credits: number;
  prerequisites: string[];
  schedule: string;
  capacity: number;
  enrolledCount: number;
  semester: number;
}
