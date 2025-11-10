'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600 font-semibold' : 'text-gray-700 hover:text-primary-600';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Oz-Blog
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={isActive('/')}>
              홈
            </Link>
            <Link href="/posts" className={isActive('/posts')}>
              게시글
            </Link>
            {isAuthenticated && (
              <Link href="/posts/new" className={isActive('/posts/new')}>
                글쓰기
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/my-page" className="flex items-center space-x-2">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {user?.username}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-sm"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary text-sm">
                  로그인
                </Link>
                <Link href="/signup" className="btn btn-primary text-sm">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="container-custom py-3">
          <div className="flex items-center justify-around">
            <Link href="/" className={`text-sm ${isActive('/')}`}>
              홈
            </Link>
            <Link href="/posts" className={`text-sm ${isActive('/posts')}`}>
              게시글
            </Link>
            {isAuthenticated && (
              <Link href="/posts/new" className={`text-sm ${isActive('/posts/new')}`}>
                글쓰기
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
