import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import CommentList from './CommentList';
import Login from './Login';
import Signout from './Signout';
import AddComment from './AddComment';
import UpdateProfile from './UpdateProfile';
import { addComment, createOrUpdateProfile, getComments, updateProfile } from './firestore';
import type { CommentType } from './types';
import './comments.css';

type Props = { slug: string };

export default function CommentSection({ slug }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      await createOrUpdateProfile(usr);
      setUser(usr);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  async function fetchComments() {
    setComments(await getComments(slug));
  }

  function saveComment(comment: string) {
    if (!user) return Promise.resolve();
    return addComment(slug, user, comment);
  }

  function updateUserProfile(displayName: string) {
    if (!user) return;
    return updateProfile(user, displayName);
  }

  return (
    <section className="comments">
      <CommentList getComments={fetchComments} comments={comments} user={user} />

      {authReady && !user && <Login auth={auth} />}

      {user && (
        <>
          <div className="comment-account">
            <UpdateProfile user={user} updateProfile={updateUserProfile} />
            <Signout auth={auth} setUser={setUser} />
          </div>
          <AddComment addComment={saveComment} getComments={fetchComments} />
        </>
      )}
    </section>
  );
}
