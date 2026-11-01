import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth';

const provider = new GoogleAuthProvider();

type Props = { auth: Auth; label?: string };

export default function Login({ auth, label = 'Sign in with Google to comment' }: Props) {
  const [authError, setAuthError] = useState<string>();

  const googleLogin = () => {
    setAuthError(undefined);
    signInWithPopup(auth, provider).catch((error) => {
      setAuthError(error.message);
    });
  };

  return (
    <>
      {authError && <p className="comment-error">{authError}</p>}
      <button type="button" className="comment-btn" onClick={googleLogin}>
        {label}
      </button>
    </>
  );
}
