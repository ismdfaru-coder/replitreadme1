
'use client';

import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import type { Article, Category } from '@/lib/types';
import { getInitialData } from '@/lib/actions';


interface DataStore {
  articles: Article[];
  categories: Category[];
  isInitialized: boolean;
  getArticleById: (id: string) => Article | undefined;
  createArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  removeArticle: (articleId: string) => void;
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
}

const DataStoreContext = createContext<DataStore | null>(null);

function useDataStoreState(): DataStore {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        if (!isInitialized) {
            const { articles, categories } = await getInitialData();
            setArticles(articles);
            setCategories(categories);
            setIsInitialized(true);
        }
    };
    loadData();
  }, [isInitialized]);

  const getArticleById = useCallback((id: string) => {
    return articles.find(a => a.id === id);
  }, [articles]);

  const createArticle = useCallback((newArticle: Article) => {
    setArticles((prevArticles) => {
        let newArticles = [...prevArticles];
        if (newArticle.featured) {
            newArticles = newArticles.map(a => ({...a, featured: false}));
        }
        // Check if article already exists to prevent duplicates
        if (!newArticles.find(a => a.id === newArticle.id)) {
          return [newArticle, ...newArticles];
        }
        return newArticles;
    });
  }, []);
  
  const updateArticle = useCallback((updatedArticle: Article) => {
    setArticles(prevArticles => {
        let newArticles = [...prevArticles];
        // If this article is being featured, un-feature all others
        if (updatedArticle.featured) {
            newArticles = newArticles.map(a => (a.id !== updatedArticle.id ? {...a, featured: false} : a));
        }

        return newArticles.map(article => {
            if (article.id === updatedArticle.id) {
                return updatedArticle;
            }
            return article;
        });
    });
  }, []);

  const removeArticle = useCallback((articleId: string) => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
  }, []);

  const addCategory = useCallback((newCategory: Category) => {
    setCategories(prev => {
        if (!prev.find(c => c.id === newCategory.id)) {
            return [...prev, newCategory];
        }
        return prev;
    });
  }, []);

  const removeCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    // Also remove articles associated with that category from the local state
    setArticles(prev => prev.filter(a => a.category.id !== categoryId));
  }, []);


  return {
    articles,
    categories,
    isInitialized,
    getArticleById,
    createArticle,
    updateArticle,
    removeArticle,
    addCategory,
    removeCategory,
  };
}


export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const store = useDataStoreState();
  return (
    <DataStoreContext.Provider value={store}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
}
