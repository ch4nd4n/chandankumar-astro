import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore/lite';
import type { User } from 'firebase/auth';
import { db } from '../../lib/firebase';
import type { CommentType } from './types';

export async function createOrUpdateProfile(user: User | null) {
  if (!user) return;
  const docSnap = await getDoc(doc(db, 'userProfiles', user.uid));
  if (!docSnap.exists()) {
    await setDoc(doc(db, 'userProfiles', user.uid), {
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
    });
  }
}

export async function updateProfile(user: User, displayName: string) {
  const { uid, photoURL } = user;
  const docSnap = await getDoc(doc(db, 'userProfiles', uid));
  if (docSnap.exists()) {
    await setDoc(doc(db, 'userProfiles', uid), { uid, photoURL, displayName });
  }
}

export function addComment(slug: string, user: User, comment: string) {
  const newComment = doc(collection(db, 'blogComments'));
  return setDoc(
    newComment,
    {
      slug,
      comment,
      authorId: user.uid,
      timestamp: serverTimestamp(),
    },
    { merge: false }
  );
}

// ACL is enforced by Firestore security rules, not here.
export function deleteComment(commentId: string) {
  return deleteDoc(doc(db, 'blogComments', commentId));
}

async function getUserProfiles(ids: string[]) {
  const userProfiles = collection(db, 'userProfiles');
  const q = query(userProfiles, where('uid', 'in', ids));
  const userList = (await getDocs(q)).docs.map((d) => d.data());
  return userList.reduce((prev: Record<string, any>, cur: any) => {
    prev[cur.uid] = cur;
    return prev;
  }, {});
}

export async function getComments(slug: string): Promise<CommentType[]> {
  const commentsCol = query(
    collection(db, 'blogComments'),
    where('slug', '==', slug),
    orderBy('timestamp')
  );
  const commentsSnap = await getDocs(commentsCol);
  if (commentsSnap.empty) return [];

  const commentList = commentsSnap.docs.map((d) => ({ ...d.data(), id: d.id })) as CommentType[];
  const profileIds = commentList.map((comment) => comment.authorId);
  const userMap = await getUserProfiles(profileIds);

  commentList.forEach((value) => {
    value.authorName = userMap[value.authorId]?.displayName ?? 'Unknown';
    value.authorPhoto = userMap[value.authorId]?.photoURL ?? null;
  });

  return commentList;
}
