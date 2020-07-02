import * as admin from 'firebase-admin';

export function push(node: string, objectToSubmit) {
  return admin
    .database()
    .ref(node)
    .push(objectToSubmit);
}
export function notify(userId: number, type: string) {
  return admin
    .database()
    .ref(`notifications/${userId}/${type}`)
    .push(1);
}
export function clearNotification(userId: number, type: string) {
  return admin
    .database()
    .ref(`notifications/${userId}/${type}`)
    .remove();
}

export function findByKey(key: string) {
  let mensagem;
  admin
    .database()
    .ref(key)
    .on('value', message => {
      try {
        mensagem = message.val();
      } catch (error) {
        console.log(error.code);
      }
    });

  return mensagem;
}
