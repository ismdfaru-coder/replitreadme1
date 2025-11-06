
import type { Author } from './types';
import { PlaceHolderImages } from './placeholder-images';


// This file is now intended for SERVER-SIDE USE ONLY to get author details.
// Actual data loading is handled in actions.ts

const getPlaceholderImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        return {
            imageUrl: "https://picsum.photos/seed/error/100/100",
            imageHint: "placeholder image"
        }
    }
    return {
        imageUrl: img.imageUrl,
        imageHint: img.imageHint,
    }
}

export const author: Author = {
  name: 'Admin User',
  avatarUrl: getPlaceholderImage('author-avatar').imageUrl,
};
