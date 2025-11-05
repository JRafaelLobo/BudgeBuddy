export interface User {
  id: string,
  email: string;
  password: string;
  birthDate: Date | null;
  status: 'Estudia' | 'Trabaja' | null;
  name?: string;
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
  | 'Otros';
  date: string;
  createdAt: string;
  updatedAt?: string;
}

