
import * as admin from 'firebase-admin';

export const increment = (num : number) => admin.firestore.FieldValue.increment(num);