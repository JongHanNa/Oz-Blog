'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { postApi } from '@/lib/api';
import { parseTags } from '@/lib/utils';
import MarkdownEditor from '@/components/forms/MarkdownEditor';

export default function NewPostPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: '',
    category_id: undefined as number | undefined,
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('제목을 입력해주세요');
      return;
    }

    if (!formData.content.trim()) {
      setError('내용을 입력해주세요');
      return;
    }

    setIsLoading(true);

    try {
      const tagsArray = parseTags(formData.tags);

      await postApi.create({
        title: formData.title,
        content: formData.content,
        thumbnail: formData.thumbnail || undefined,
        category_id: formData.category_id,
        tags: tagsArray,
      });

      router.push('/posts');
    } catch (error) {
      setError(error instanceof Error ? error.message : '게시글 작성에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">새 게시글 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="input"
              placeholder="게시글 제목을 입력하세요"
              required
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              썸네일 URL (선택)
            </label>
            <input
              id="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={(e) => handleChange('thumbnail', e.target.value)}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              태그 (쉼표로 구분)
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="input"
              placeholder="개발, React, TypeScript"
            />
            <p className="mt-1 text-sm text-gray-500">
              여러 개의 태그를 쉼표로 구분하여 입력하세요
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? '작성 중...' : '게시하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
