export type CommentType = {
  id: string;
  slug: string;
  comment: string;
  authorId: string;
  authorName?: string;
  authorPhoto?: string | null;
  timestamp: { seconds: number } | null;
};
