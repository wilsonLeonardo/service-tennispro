import * as admin from 'firebase-admin';

export function push(node: string, objectToSubmit: string) {
  return admin
    .database()
    .ref(node)
    .push(objectToSubmit);
}
