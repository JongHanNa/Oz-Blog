'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePostStore } from '@/store/postStore';
import PostCard from '@/components/ui/PostCard';
import Loading from '@/components/ui/Loading';

export default function HomePage() {
  const router = useRouter();
  const { posts, isLoading, fetchPosts, setFilters } = usePostStore();

  useEffect(() => {
    setFilters({ limit: 6 });
    fetchPosts();
  }, []);

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            환영합니다! <span className="text-primary-600">Oz-Blog</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            마크다운으로 글을 작성하고 공유하는 현대적인 블로그 플랫폼입니다.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/posts" className="btn btn-primary">
              게시글 보기
            </Link>
            <Link href="/signup" className="btn btn-outline">
              시작하기
            </Link>
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">최근 게시글</h2>
            <Link href="/posts" className="text-primary-600 hover:underline">
              전체 보기 →
            </Link>
          </div>

          {isLoading ? (
            <Loading />
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">아직 게시글이 없습니다.</p>
              <Link href="/posts/new" className="btn btn-primary mt-4">
                첫 게시글 작성하기
              </Link>
            </div>
          )}
        </section>

        {/* Features */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">마크다운 에디터</h3>
              <p className="text-gray-600">
                직관적인 마크다운 에디터로 쉽고 빠르게 글을 작성하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">댓글 시스템</h3>
              <p className="text-gray-600">
                대댓글을 포함한 댓글 시스템으로 활발한 소통을 나누세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">태그 & 카테고리</h3>
              <p className="text-gray-600">
                태그와 카테고리로 글을 체계적으로 관리하고 찾아보세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
