import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { deleteComment, getAllComments } from '../comments/firestore';
import Login from '../comments/Login';
import Signout from '../comments/Signout';
import type { CommentType } from '../comments/types';
import '../comments/comments.css';
import './admin.css';

const ADMIN_UID = import.meta.env.PUBLIC_ADMIN_UID as string | undefined;

function formatDate(seconds?: number) {
  if (!seconds) return '—';
  return new Date(seconds * 1000).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const isOwner = !!user && !!ADMIN_UID && user.uid === ADMIN_UID;

  async function loadComments() {
    setLoading(true);
    try {
      setComments(await getAllComments());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOwner) loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  async function moderate(comment: CommentType) {
    const confirmed = window.confirm(`Delete this comment by ${comment.authorName}?`);
    if (!confirmed) return;
    await deleteComment(comment.id);
    await loadComments();
  }

  if (!authReady) {
    return <p className="admin-status">Checking authentication…</p>;
  }

  if (!user) {
    return (
      <div className="admin-gate">
        <p className="admin-status">Sign in with the owner account to moderate comments.</p>
        <Login auth={auth} label="Sign in with Google" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="admin-gate">
        <p className="admin-status">
          Signed in as {user.displayName}, but this account is not authorized to view the admin panel.
        </p>
        <Signout auth={auth} setUser={setUser} />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <span className="admin-status">Signed in as {user.displayName}</span>
        <Signout auth={auth} setUser={setUser} />
      </div>

      {loading && <p className="admin-status">Loading comments…</p>}
      {!loading && comments.length === 0 && <p className="admin-status">No comments yet.</p>}

      {!loading && comments.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Post</th>
              <th>Author</th>
              <th>Posted</th>
              <th>Comment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td>
                  <a href={`/blog/${comment.slug}`} target="_blank" rel="noopener">{comment.slug}</a>
                </td>
                <td>{comment.authorName}</td>
                <td>{formatDate(comment.timestamp?.seconds)}</td>
                <td className="admin-comment-cell">{comment.comment}</td>
                <td>
                  <button type="button" className="comment-delete" onClick={() => moderate(comment)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
