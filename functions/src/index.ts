import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions/v2';
import { Resend } from 'resend';

initializeApp();
const db = getFirestore();

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const NOTIFY_TO_EMAIL = process.env.NOTIFY_TO_EMAIL ?? '';
const NOTIFY_FROM_EMAIL = process.env.NOTIFY_FROM_EMAIL ?? '';

export const onNewComment = onDocumentCreated('blogComments/{commentId}', async (event) => {
  const snap = event.data;
  if (!snap) return;

  const comment = snap.data();
  const { slug, comment: commentText, authorId } = comment as {
    slug: string;
    comment: string;
    authorId: string;
  };

  if (!RESEND_API_KEY || !NOTIFY_TO_EMAIL || !NOTIFY_FROM_EMAIL) {
    logger.warn('onNewComment: missing RESEND_API_KEY / NOTIFY_TO_EMAIL / NOTIFY_FROM_EMAIL — skipping notification');
    return;
  }

  const profileSnap = await db.collection('userProfiles').doc(authorId).get();
  const profile = profileSnap.exists ? profileSnap.data() : null;
  const authorName = profile?.displayName ?? 'Someone';

  const postUrl = `https://chandankumar.com/blog/${slug}`;
  const resend = new Resend(RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: NOTIFY_FROM_EMAIL,
      to: NOTIFY_TO_EMAIL,
      subject: `New comment from ${authorName} on "${slug}"`,
      html: `
        <p><strong>${escapeHtml(authorName)}</strong> commented on <a href="${postUrl}">${escapeHtml(slug)}</a>:</p>
        <blockquote style="margin:0;padding-left:12px;border-left:3px solid #D62828;color:#2D2A26;">
          ${escapeHtml(commentText)}
        </blockquote>
        <p><a href="${postUrl}">View the post</a></p>
      `,
    });
  } catch (error) {
    logger.error('onNewComment: failed to send notification email', error);
  }
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
