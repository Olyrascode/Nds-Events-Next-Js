// import { deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import { COLLECTIONS } from '../firebase/collections';

// export const deleteItem = async (id, type) => {
//   try {
//     const collection = type === 'pack' ? COLLECTIONS.PACKS : COLLECTIONS.PRODUCTS;
//     await deleteDoc(doc(db, collection, id));
//   } catch (error) {
//     console.error('Error deleting item:', error);
//     throw error;
//   }
// };