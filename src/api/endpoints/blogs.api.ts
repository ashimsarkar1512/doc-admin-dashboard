import { axiosInstance } from '../axiosInstance';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
}

export interface BlogProvider {
  id: string;
  userId: string;
  name: string;
  title: string;
  avatar?: {
    fileUrl: string;
  };
}

export interface BlogFeaturedImage {
  id: string;
  fileUrl: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  categoryId?: string;
  providerId?: string;
  author?: BlogAuthor;
  category?: BlogCategory;
  provider?: BlogProvider;
  featuredImage?: BlogFeaturedImage;
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isPublished?: boolean;
}

export interface PaginatedBlogsResponse {
  data: Blog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getBlogs = async (params?: GetBlogsParams): Promise<PaginatedBlogsResponse> => {
  const { data } = await axiosInstance.get<PaginatedBlogsResponse>('/admin/blogs', { params });
  return data;
};

export interface CreateBlogPayload {
  title: string;
  content: string;
  categoryId: string;
  providerId: string;
  featuredImageId: string;
  isPublished: boolean;
}

export const createBlog = async (payload: CreateBlogPayload): Promise<Blog> => {
  const { data } = await axiosInstance.post<{ success: boolean; data: Blog }>('/admin/blogs', payload);
  return data.data;
};

export const updateBlog = async (id: string, payload: Partial<CreateBlogPayload>): Promise<Blog> => {
  const { data } = await axiosInstance.patch<{ success: boolean; data: Blog }>(`/admin/blogs/${id}`, payload);
  return data.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/blogs/${id}`);
};
