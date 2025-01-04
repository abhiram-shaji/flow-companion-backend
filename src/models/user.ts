  
export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'Admin' | 'Worker';
    assignedProjects?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  