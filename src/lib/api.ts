import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.glose.com',
  timeout: 10000,
});

export interface User {
  _id: string;
  name: string;
  image?: string;
}

export interface Shelf {
  id: string;
  title: string;
  slug?: string;
  user: User;
  booksCount?: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
}

export interface BookInfo {
  id: string;
  slug: string;
}

export interface BookPermissions {
  print: boolean;
  access: boolean;
}

export interface BookExtents {
  gl_pages: number;
}

export interface Book {
  id: string;
  authors: Author[];
  book: BookInfo;
  can: BookPermissions;
  form: string;
  language: string;
  short_title: string;
  title: string;
  description: string;
  extents: BookExtents;
  isbn: string;
  publisher: string;
  tags: string[];
  image: string;
  adult: boolean;
  is_free: boolean;
  // Legacy fields for backward compatibility
  _id?: string;
  price?: number;
  averageRating?: number;
}

export interface ShelfBooksResponse {
  forms: string[];
}

// Récupérer la liste des étagères d'un utilisateur
export const fetchUserShelves = async (userId: string): Promise<Shelf[]> => {
  try {
    const response = await api.get(`/users/${userId}/shelves`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user shelves:', error);
    throw error;
  }
};

// Récupérer les IDs des livres d'une étagère
export const fetchShelfBooks = async (shelfId: string): Promise<string[]> => {
  try {
    const response = await api.get(`/shelves/5c617433fefd4c0001f061c8/forms`);
    return response.data.forms || response.data;
  } catch (error) {
    console.error('Error fetching shelf books:', error);
    throw error;
  }
};

// Récupérer les détails d'un livre
export const fetchBookDetails = async (formId: string): Promise<Book> => {
  try {
    const response = await api.get(`/forms/${formId}`);
    console.log(`Book details fetched successfully for ID: ${formId}`);
    return response.data;
    
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

// Récupérer plusieurs livres avec pagination
export const fetchBooksWithPagination = async (
  formIds: string[],
  page: number = 1,
  limit: number = 10
): Promise<{ books: Book[]; hasMore: boolean; total: number }> => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedIds = formIds.slice(startIndex, endIndex);
  
  try {
    const bookPromises = paginatedIds.map(id => fetchBookDetails(id));
    const books = await Promise.allSettled(bookPromises);
    
    const validBooks = books
      .filter((result): result is PromiseFulfilledResult<Book> => result.status === 'fulfilled')
      .map(result => result.value);
    
    return {
      books: validBooks,
      hasMore: endIndex < formIds.length,
      total: formIds.length
    };
  } catch (error) {
    console.error('Error fetching paginated books:', error);
    throw error;
  }
};
