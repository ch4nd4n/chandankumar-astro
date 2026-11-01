import { useState } from 'react';

type Props = {
  addComment: (comment: string) => Promise<void>;
  getComments: () => Promise<void>;
};

export default function AddComment({ addComment, getComments }: Props) {
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = userComment.trim() !== '' && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await addComment(userComment.trim());
      setUserComment('');
      await getComments();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <textarea
        className="comment-form-textarea"
        aria-label="Add a comment"
        placeholder="Add a comment…"
        value={userComment}
        onChange={(e) => setUserComment(e.currentTarget.value)}
      />
      <div className="comment-form-actions">
        <button type="button" className="comment-btn" disabled={!canSubmit} onClick={submit}>
          {submitting ? 'Posting…' : 'Add comment'}
        </button>
      </div>
    </div>
  );
}
