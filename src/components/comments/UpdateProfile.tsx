import { useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';

type Props = {
  user: User;
  updateProfile: (displayName: string) => Promise<void> | void;
};

export default function UpdateProfile({ user, updateProfile }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [editable, setEditable] = useState(false);

  function toggleEdit(e: FormEvent) {
    e.preventDefault();
    setEditable(!editable);
  }

  function cancelEdit(e: FormEvent) {
    e.preventDefault();
    setEditable(false);
  }

  return (
    <>
      <button type="button" className="comment-account-name" onClick={toggleEdit}>
        {user.displayName}
      </button>
      {editable && (
        <div className="comment-edit-profile">
          <input
            aria-label="Display name"
            placeholder="Change display name for comments"
            onChange={(e) => setDisplayName(e.currentTarget.value)}
          />
          <button
            type="button"
            className="comment-btn"
            onClick={async () => {
              await updateProfile(displayName);
              setEditable(false);
            }}
          >
            Save
          </button>
          <button type="button" className="comment-btn comment-btn-secondary" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
