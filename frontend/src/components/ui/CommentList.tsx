'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useCommentStore } from '@/store/commentStore';
import type { Comment } from '@/types';

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { comments, addComment, deleteComment, isLoading } = useCommentStore();

  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({
        content: newComment,
        post_id: postId,
        parent_id: null,
      });
      setNewComment('');
    } catch (error) {
      // Error handled in store
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    try {
      await addComment({
        content: replyContent,
        post_id: postId,
        parent_id: parentId,
      });
      setReplyContent('');
      setReplyTo(null);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      // Error handled in store
    }
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <div
      key={comment.id}
      className={`${isReply ? 'ml-12 mt-4' : 'mb-6'} ${isReply ? 'border-l-2 border-gray-200 pl-4' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        {comment.profile_image ? (
          <img
            src={comment.profile_image}
            alt={comment.username}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {comment.username.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{comment.username}</span>
            <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
          </div>

          <p className="text-gray-700 mb-2 whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center space-x-4 text-sm">
            {isAuthenticated && !isReply && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="text-primary-600 hover:text-primary-700"
              >
                답글
              </button>
            )}

            {user && user.id === comment.user_id && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-600 hover:text-red-700"
              >
                삭제
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-3">
              <div className="flex items-start space-x-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요..."
                  className="textarea flex-1"
                  rows={3}
                />
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim()}
                    className="btn btn-primary text-sm"
                  >
                    작성
                  </button>
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="btn btn-secondary text-sm"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">댓글 {comments.length}개</h2>

      {/* New Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-3">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="textarea mb-2"
                rows={4}
              />
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mb-8">
          <p className="text-gray-600 mb-4">댓글을 작성하려면 로그인이 필요합니다</p>
          <a href="/login" className="btn btn-primary">
            로그인
          </a>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => renderComment(comment))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
        </div>
      )}
    </div>
  );
}
