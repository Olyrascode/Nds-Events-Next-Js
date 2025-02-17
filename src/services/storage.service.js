import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, auth } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const uploadProductImage = async (file) => {
  try {
    if (!file) return null;

    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be logged in to upload images');
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists() || !userDoc.data().isAdmin) {
      throw new Error('Only administrators can upload images');
    }

    const filename = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `products/${filename}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteProductImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const user = auth.currentUser;
    if (!user) {
      throw new Error('You must be logged in to delete images');
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists() || !userDoc.data().isAdmin) {
      throw new Error('Only administrators can delete images');
    }

    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};