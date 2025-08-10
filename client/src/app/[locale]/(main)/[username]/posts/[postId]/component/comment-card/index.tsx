
import React from 'react';
import type { Comment } from './types';
import { Card, CardContent } from '@/components/ui/card';
import AvatarRole from '@/components/avatar-with-role-border'
import Link from 'next/link';
import { useTimeAgo } from '@/hooks/use-get-time-ago';

const CommentCard = (
  { comment }: { comment: Comment }
) => {
  const getTimeAgo = useTimeAgo();
  return (
    <div className="flex items-start gap-4 w-full mb-2">
      <AvatarRole
        image={comment?.author?.image}
        username={comment?.author?.username}
        role={comment?.author?.role}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div>
          <Link href={`/${comment?.author.username}`}>
            <span className="font-semibold">
              {comment?.author.displayUsername ||
                comment?.author.username}
            </span>
            <span className="text-foreground/50 font-medium">
              {` @${comment?.author.username}`}
            </span>
          </Link>

          <span className="text-foreground/50 font-medium">
            {` `}·{' '}
            {getTimeAgo(new Date(comment?.createdAt))}
          </span>

        </div>

        <pre className="whitespace-pre-wrap break-words">
          {comment?.content}
        </pre>
      </div>
    </div>
  );
};

export default CommentCard;