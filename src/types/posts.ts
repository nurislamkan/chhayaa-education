export interface PostsType {
  id: number;
  title: string;
  content: string;
  identifier: string;
  categoryId: number;
  createdBy: string;
  deleted: number;
  createdAt: string;
  updatedAt: string;
  tags?: [];
}

export type PagesType = {
  id: number;
  title: string;
  identifier: string;
  content: string;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
  deleted: boolean;
  status: number;
};

export type productsType = {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  rating: number;
  totalLesson: number;
  TotalStudents: number;
  language: string;
  duration: string;
};
export type StudentType = {
  id: number;
  title: string;
  identifier: string;
  content: string;
  imageUrl: string;
  totalproduct: number;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
  deleted: boolean;
  status: string;
};

export type LessonType = {
  id: number;
  name: string;
  identifier: string;
  details: number;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
  deleted: boolean;
  status: string;
};

export type InstructorType = {
  id?: number;
  identifier: string;
  title?: string;
  content?: string;
  rating?: number;
  totalproduct?: number;
  featured?: boolean;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  deleted?: boolean;
};
