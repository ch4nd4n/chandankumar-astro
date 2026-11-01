import type { Auth, User } from 'firebase/auth';

export default function Signout({ auth, setUser }: { auth: Auth; setUser: (u: User | null) => void }) {
  return (
    <button
      type="button"
      className="comment-btn comment-btn-secondary"
      onClick={() => auth.signOut().then(() => setUser(null))}
    >
      Sign out
    </button>
  );
}
