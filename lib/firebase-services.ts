import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Post, Comment } from '../types';

// User Services
export const userService = {
  getCurrentUser: async (userId: string) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() as User : null;
  },

  getUser: async (userId: string) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() as User : null;
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
    return userService.getUser(userId);
  }
};

// Post Services
export const postService = {
  getPosts: async () => {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(postsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  },

  getPost: async (postId: string) => {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    return postDoc.exists() ? { id: postDoc.id, ...postDoc.data() } as Post : null;
  },

  createPost: async (data: Omit<Post, 'id' | 'createdAt'>) => {
    const postData = {
      ...data,
      createdAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'posts'), postData);
    return { id: docRef.id, ...postData } as Post;
  },

  updatePost: async (postId: string, data: Partial<Post>) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, data);
    return postService.getPost(postId);
  },

  deletePost: async (postId: string) => {
    await deleteDoc(doc(db, 'posts', postId));
  }
};

// Comment Services
export const commentService = {
  getComments: async (postId: string) => {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(commentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
  },

  createComment: async (data: Omit<Comment, 'id' | 'createdAt'>) => {
    const commentData = {
      ...data,
      createdAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'comments'), commentData);
    return { id: docRef.id, ...commentData } as Comment;
  },

  updateComment: async (commentId: string, data: Partial<Comment>) => {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, data);
  },

  deleteComment: async (commentId: string) => {
    await deleteDoc(doc(db, 'comments', commentId));
  }
}; 