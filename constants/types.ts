export interface User {
  id: string,
  email: string;
  password: string;
  birthDate: Date | null;
  status: 'Estudia' | 'Trabaja' | null;
  name: string;
  premium: boolean
}

export interface Transaction {
  id: string,
  type: string,
  amount: number,
  description: string,
  category:
  | 'Comida'
  | 'Transporte'
  | 'Educación'
  | 'Ocio'
  | 'Salud'
  | 'Servicios'
  | 'Mesada'
  | 'Trabajo'
  | 'Apoyo Familiar'
  | 'Becas'
  | 'Negocios'
  | 'Inversiones'
  | 'Otros';

  date: string;
  createdAt: string;
  updatedAt?: string;
  
  // Campos para pagos programados
  isRecurring?: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextRecurrenceDate?: string;
  recurrenceCount?: number; // Número de veces que se repetirá (undefined = infinito)
}

