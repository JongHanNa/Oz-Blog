'use client';

import { useEffect, useState } from 'react';
import { usePostStore } from '@/store/postStore';
import PostCard from '@/components/ui/PostCard';
import SearchBar from '@/components/ui/SearchBar';
import Loading from '@/components/ui/Loading';

export default function PostsPage() {
  const { posts, isLoading, filters, totalPages, currentPage, fetchPosts, setFilters } = usePostStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilters({ category: category || undefined, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['전체', '개발', '디자인', '일상', '기타'];

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">게시글</h1>
          <p className="text-gray-600">다양한 주제의 게시글을 읽어보세요</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="max-w-2xl">
            <SearchBar onSearch={handleSearch} placeholder="게시글 검색..." />
          </div>

          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category === '전체' ? '' : category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  (category === '전체' && !selectedCategory) || selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <Loading />
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
