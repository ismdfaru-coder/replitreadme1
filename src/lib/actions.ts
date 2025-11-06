
'use server';

import 'dotenv/config';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { optimizeContentBlocks, type OptimizeContentBlocksInput } from '@/ai/flows/optimize-content-blocks';
import type { Article, Category, DbData } from './types';
import { author } from './data';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'ismdfaru-coder';
const GITHUB_REPO = 'studioarticle';
const DB_FILE_PATH = 'data/db.json';
const BRANCH = 'main';

// --- GitHub as DB Functions ---

async function getDbFromGithub(): Promise<{ data: DbData; sha: string | null }> {
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DB_FILE_PATH}`;
    const response = await fetch(`${url}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store', 
    });

    if (response.ok) {
      const file = await response.json();
      const content = Buffer.from(file.content, 'base64').toString('utf-8');
      return { data: JSON.parse(content), sha: file.sha };
    }

    if (response.status === 404) {
      return { data: { articles: [], categories: [] }, sha: null };
    }

    throw new Error(`Failed to fetch DB from GitHub: ${response.statusText}`);

  } catch (error) {
    console.error("Error loading data from GitHub:", error);
    return { data: { articles: [], categories: [] }, sha: null };
  }
}

async function saveDbToGithub(data: DbData, sha: string | null, message: string): Promise<{ success: boolean; message: string }> {
  if (!GITHUB_TOKEN) {
    return { success: false, message: 'GitHub token is not configured.' };
  }
  
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DB_FILE_PATH}`;
    const contentBase64 = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

    const body: { message: string; content: string; branch: string; sha?: string | null } = {
      message,
      content: contentBase64,
      branch: BRANCH,
    };
    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GitHub API Error: ${errorData.message || response.statusText}`);
    }

    revalidatePath('/', 'layout');

    return { success: true, message: 'Database updated successfully on GitHub.' };
  } catch (e: any) {
    console.error("GitHub Upload failed:", e);
    return { success: false, message: `GitHub Upload failed: ${e.message}` };
  }
}


// --- Main Application Actions ---

export async function getInitialData() {
    const { data: db } = await getDbFromGithub();
    const articlesWithAuthor = db.articles.map(article => {
        const categoryId = typeof article.category === 'string' ? article.category : (article.category as Category)?.id;
        const resolvedCategory = db.categories.find(c => c.id === categoryId);
        
        return {
            ...article,
            author: author,
            category: resolvedCategory ?? article.category,
            comments: article.comments ?? [],
        };
    });
    return { articles: articlesWithAuthor, categories: db.categories };
}


const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required.'),
  content: z.string().min(1, 'Content is required.'),
  category: z.string().min(1, 'Category is required.'),
  featured: z.boolean(),
  videoUrl: z.string().optional(),
});

export async function createArticle(data: {
    id?: string;
    title: string;
    content: string;
    category: string;
    featured: boolean;
    videoUrl?: string;
}) {
  try {
    const validatedFields = articleSchema.safeParse(data);
    
    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }

    const { data: db, sha } = await getDbFromGithub();
    const isUpdate = !!validatedFields.data.id;

    const category = db.categories.find(c => c.id === validatedFields.data.category);
    if (!category) {
      return { message: "Category not found.", errors: { category: "Invalid category selected."}, data: null};
    }

    const cleanContentForExcerpt = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    }
    
    let updatedArticle: Article | undefined;
    let commitMessage = '';

    if (isUpdate) {
        let articleExists = false;
        db.articles = db.articles.map(article => {
            if (article.id === validatedFields.data.id) {
                articleExists = true;
                const excerptText = cleanContentForExcerpt(validatedFields.data.content);
                updatedArticle = {
                    ...article,
                    title: validatedFields.data.title,
                    slug: validatedFields.data.title.toLowerCase().replace(/\\s+/g, '-'),
                    content: validatedFields.data.content,
                    excerpt: excerptText.substring(0, 150) + '...',
                    category: category,
                    featured: validatedFields.data.featured,
                    videoUrl: validatedFields.data.videoUrl,
                };
                return updatedArticle;
            }
            return article;
        });

        if (!articleExists) {
            return { message: "Article not found for update.", errors: { server: "Article ID is invalid."}, data: null};
        }
        
        if (validatedFields.data.featured) {
            db.articles = db.articles.map(a => 
                a.id !== validatedFields.data.id ? { ...a, featured: false } : a
            );
        }
        commitMessage = `feat: Update article "${validatedFields.data.title}"`;

    } else {
        const excerptText = cleanContentForExcerpt(validatedFields.data.content);
        const newArticle: Article = {
            id: (Date.now()).toString(),
            title: validatedFields.data.title,
            slug: validatedFields.data.title.toLowerCase().replace(/\\s+/g, '-'),
            excerpt: excerptText.substring(0, 150) + '...',
            content: validatedFields.data.content,
            imageUrl: `https://picsum.photos/seed/${Math.random()}/1200/800`,
            imageHint: validatedFields.data.title.split(' ').slice(0, 2).join(' ').toLowerCase(),
            category,
            author,
            publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            featured: validatedFields.data.featured,
            videoUrl: validatedFields.data.videoUrl,
            comments: [],
        };

        if (newArticle.featured) {
            db.articles.forEach(a => a.featured = false);
        }
        db.articles.unshift(newArticle);
        updatedArticle = newArticle;
        commitMessage = `feat: Create new article "${validatedFields.data.title}"`;
    }
    
    const saveResult = await saveDbToGithub(db, sha, commitMessage);
    if (!saveResult.success) {
      throw new Error(saveResult.message);
    }
    
    return { 
        message: `Article ${isUpdate ? 'updated' : 'created'} successfully.`, 
        errors: null,
        data: { ...updatedArticle, author: author }
    };

  } catch (e: any) {
    return { message: `Failed to save article.`, errors: { server: e.message || 'An unexpected error occurred.' }, data: null };
  }
}

export async function deleteArticle(articleId: string): Promise<{ success: boolean; message: string }> {
    if (!articleId) {
        return { success: false, message: 'Article ID is required.' };
    }

    try {
        const { data: db, sha } = await getDbFromGithub();

        const articleToDelete = db.articles.find(a => a.id === articleId);
        if (!articleToDelete) {
            return { success: false, message: 'Article not found.' };
        }

        db.articles = db.articles.filter(a => a.id !== articleId);

        const saveResult = await saveDbToGithub(db, sha, `feat: Delete article "${articleToDelete.title}"`);
        if (!saveResult.success) {
            throw new Error(saveResult.message);
        }

        return { success: true, message: 'Article deleted successfully.' };
    } catch (e: any) {
        console.error('Failed to delete article:', e);
        return { success: false, message: e.message || 'An unexpected error occurred.' };
    }
}


const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
    slug: z.string().min(1, 'Category slug is required.'),
});

export async function manageCategory(prevState: any, formData: FormData) {
    try {
        const validatedFields = categorySchema.safeParse({
            name: formData.get('name'),
            slug: formData.get('slug'),
        });

        if (!validatedFields.success) {
            return {
                message: "Invalid category data.",
                errors: validatedFields.error.flatten().fieldErrors,
                data: null,
            };
        }
        
        const { data: db, sha } = await getDbFromGithub();
        
        const existingCategory = db.categories.find(c => c.slug === validatedFields.data.slug);
        if (existingCategory) {
            return {
                message: "Category slug must be unique.",
                errors: { slug: ["This slug is already in use."] },
                data: null,
            };
        }

        const newCategory: Category = {
            id: (Date.now()).toString(),
            name: validatedFields.data.name,
            slug: validatedFields.data.slug,
        };

        db.categories.push(newCategory);
        const saveResult = await saveDbToGithub(db, sha, `feat: Add category "${newCategory.name}"`);
        if (!saveResult.success) {
          throw new Error(saveResult.message);
        }
        
        return { message: "Category added successfully.", errors: null, data: newCategory };
    } catch(e: any) {
        return { message: "Failed to manage category.", errors: { server: e.message || 'An unexpected error occurred.' }, data: null };
    }
}

export async function deleteCategory(categoryId: string): Promise<{ success: boolean; message: string }> {
  if (!categoryId) {
    return { success: false, message: 'Category ID is required.' };
  }

  try {
    const { data: db, sha } = await getDbFromGithub();

    const isCategoryInUse = db.articles.some(article => {
        const catId = typeof article.category === 'string' ? article.category : (article.category as Category)?.id;
        return catId === categoryId;
    });

    if (isCategoryInUse) {
      return { success: false, message: 'Cannot delete category. It is currently in use by one or more articles.' };
    }

    const categoryToDelete = db.categories.find(c => c.id === categoryId);
    if (!categoryToDelete) {
        return { success: false, message: 'Category not found.' };
    }

    db.categories = db.categories.filter(c => c.id !== categoryId);

    const saveResult = await saveDbToGithub(db, sha, `feat: Delete category "${categoryToDelete.name}"`);
     if (!saveResult.success) {
      throw new Error(saveResult.message);
    }

    return { success: true, message: 'Category deleted successfully.' };
  } catch (e: any) {
    console.error('Failed to delete category:', e);
    return { success: false, message: e.message || 'An unexpected error occurred.' };
  }
}


export async function callOptimizeContent(input: OptimizeContentBlocksInput) {
    try {
        const result = await optimizeContentBlocks(input);
        return { success: true, data: result };
    } catch(error) {
        console.error(error);
        return { success: false, error: 'Failed to optimize content.' };
    }
}

export async function getDbJsonString(): Promise<string> {
    const { data: db } = await getDbFromGithub();
    return JSON.stringify(db, null, 2);
}

export async function uploadDbJsonToGithub(prevState: any, formData: FormData): Promise<{success: boolean; message: string}> {
    const file = formData.get('jsonFile') as File;
    if (!file || file.size === 0) {
        return { success: false, message: 'No file uploaded.' };
    }

    try {
        const { data: existingDb, sha } = await getDbFromGithub();
        
        const uploadedContent = await file.text();
        const uploadedDb = JSON.parse(uploadedContent);

        const categoriesMap = new Map<string, Category>();
        existingDb.categories.forEach(cat => categoriesMap.set(cat.slug, cat));
        if (uploadedDb.categories && Array.isArray(uploadedDb.categories)) {
            uploadedDb.categories.forEach((cat: Category) => {
                if (cat.slug && !categoriesMap.has(cat.slug)) {
                    categoriesMap.set(cat.slug, cat);
                }
            });
        }
        const mergedCategories = Array.from(categoriesMap.values());
        
        const finalCategoriesById = new Map<string, Category>();
        mergedCategories.forEach(cat => finalCategoriesById.set(cat.id, cat));

        const articlesMap = new Map<string, Article>();
        existingDb.articles.forEach(art => articlesMap.set(art.id, art));
        
        if (uploadedDb.articles && Array.isArray(uploadedDb.articles)) {
            uploadedDb.articles.forEach((art: Article) => {
                if (art.id && !articlesMap.has(art.id)) {
                    const categoryId = typeof art.category === 'string' ? art.category : (art.category as Category)?.id;
                    const resolvedCategory = finalCategoriesById.get(categoryId);
                    
                    if (resolvedCategory) {
                       const completeArticle = { 
                           ...art, 
                           category: resolvedCategory,
                           author: author,
                           comments: art.comments ?? [],
                        };
                       articlesMap.set(art.id, completeArticle);
                    }
                }
            });
        }
        const mergedArticles = Array.from(articlesMap.values());

        const mergedDb: DbData = {
            categories: mergedCategories,
            articles: mergedArticles,
        };
        
        const saveResult = await saveDbToGithub(mergedDb, sha, 'feat: Merge and update database via admin panel upload');
        
        if (saveResult.success) {
            revalidatePath('/', 'layout');
            return { success: true, message: 'Data successfully merged and uploaded.' };
        } else {
            return saveResult;
        }

    } catch (e: any) {
        console.error("GitHub Upload failed:", e);
        return { success: false, message: `GitHub Upload failed: ${e.message}` };
    }
}

const commentSchema = z.object({
    articleId: z.string(),
    author: z.string().min(1, "Name is required."),
    content: z.string().min(1, "Comment content is required."),
});

export async function addComment(data: {
    articleId: string;
    author: string;
    content: string;
}) {
    try {
        const validatedFields = commentSchema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid comment data.',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { data: db, sha } = await getDbFromGithub();

        let updatedArticle: Article | undefined;
        const newArticles = db.articles.map(article => {
            if (article.id === validatedFields.data.articleId) {
                const newComment = {
                    id: Date.now().toString(),
                    author: validatedFields.data.author,
                    content: validatedFields.data.content,
                    createdAt: new Date().toISOString(),
                };
                if (!article.comments) {
                    article.comments = [];
                }
                article.comments.push(newComment);
                updatedArticle = article;
            }
            return article;
        });

        if (!updatedArticle) {
            return { success: false, message: 'Article not found.' };
        }

        db.articles = newArticles;
        const saveResult = await saveDbToGithub(db, sha, `feat: Add comment to article "${updatedArticle.title}"`);
        if (!saveResult.success) {
            throw new Error(saveResult.message);
        }

        return { success: true, message: 'Comment added successfully.', data: updatedArticle };

    } catch (e: any) {
        return { success: false, message: e.message || 'Failed to add comment.' };
    }
}
