'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { usePostStore } from '@/store/postStore';
import { useCommentStore } from '@/store/commentStore';
import { interactionApi } from '@/lib/api';
import CommentList from '@/components/ui/CommentList';
import Loading from '@/components/ui/Loading';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const { user, isAuthenticated } = useAuthStore();
  const { currentPost, isLoading, fetchPostById, clearCurrentPost } = usePostStore();
  const { fetchComments, clearComments } = useCommentStore();

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
      fetchComments(postId);
    }

    return () => {
      clearCurrentPost();
      clearComments();
    };
  }, [postId]);

  useEffect(() => {
    if (currentPost) {
      setIsLiked(currentPost.is_liked);
      setIsBookmarked(currentPost.is_bookmarked);
      setLikeCount(currentPost.like_count);
    }
  }, [currentPost]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await interactionApi.toggleLike(postId);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await interactionApi.toggleBookmark(postId);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!currentPost) {
    return (
      <div className="py-12">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
          <button onClick={() => router.back()} className="btn btn-primary">
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <article className="bg-white rounded-lg shadow-md p-8 mb-8">
          {/* Category & Tags */}
          <div className="flex items-center gap-2 mb-4">
            {currentPost.category_name && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                {currentPost.category_name}
              </span>
            )}
            {currentPost.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-6">{currentPost.title}</h1>

          {/* Meta */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {currentPost.author_image ? (
                <img
                  src={currentPost.author_image}
                  alt={currentPost.author_name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  {currentPost.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{currentPost.author_name}</div>
                <div className="text-sm text-gray-500">{formatDate(currentPost.created_at)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span>{currentPost.view_count}</span>
              </span>
            </div>
          </div>

          {/* Thumbnail */}
          {currentPost.thumbnail && (
            <div className="my-8">
              <img
                src={currentPost.thumbnail}
                alt={currentPost.title}
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="markdown-content mt-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {currentPost.content}
            </ReactMarkdown>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="font-medium">{likeCount}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-6 h-6" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span className="font-medium">북마크</span>
            </button>
          </div>
        </article>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <CommentList postId={postId} />
        </div>
      </div>
    </div>
  );
}
