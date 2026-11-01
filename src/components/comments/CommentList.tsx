import { useEffect } from 'react';
import type { User } from 'firebase/auth';
import { deleteComment } from './firestore';
import type { CommentType } from './types';

function formatDate(seconds: number) {
  return new Date(seconds * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

async function confirmDelete(comment: CommentType, getComments: () => Promise<void>) {
  const confirmed = window.confirm('Delete this comment?');
  if (!confirmed) return;
  await deleteComment(comment.id);
  await getComments();
}

type Props = {
  comments: CommentType[];
  user: User | null;
  getComments: () => Promise<void>;
};

export default function CommentList({ comments, user, getComments }: Props) {
  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 className="comments-heading">Comments ({comments.length})</h3>
      {comments.length === 0 && <p className="comment-empty">No comments yet — be the first.</p>}
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-item-header">
              {comment.authorPhoto && (
                <img className="comment-avatar" src={comment.authorPhoto} alt="" />
              )}
              <span className="comment-author">{comment.authorName}</span>
              {comment.timestamp && (
                <span className="comment-date">{formatDate(comment.timestamp.seconds)}</span>
              )}
              {user && comment.authorId === user.uid && (
                <button
                  type="button"
                  className="comment-delete"
                  onClick={() => confirmDelete(comment, getComments)}
                >
                  Delete
                </button>
              )}
            </div>
            <p className="comment-body">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
