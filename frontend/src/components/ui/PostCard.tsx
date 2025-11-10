import Link from 'next/link';
import { formatDate, extractPreview } from '@/lib/utils';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const preview = extractPreview(post.content, 150);

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="card p-6 cursor-pointer">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="mb-4 aspect-video overflow-hidden rounded-lg">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-3">
          {post.category_name && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
              {post.category_name}
            </span>
          )}
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
          {post.title}
        </h3>

        {/* Preview */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {preview}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            {post.author_image ? (
              <img
                src={post.author_image}
                alt={post.author_name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                {post.author_name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium">{post.author_name}</span>
            <span>·</span>
            <span>{formatDate(post.created_at)}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{post.view_count}</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.like_count}</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
