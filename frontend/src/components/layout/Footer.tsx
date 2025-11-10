export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Oz-Blog</h3>
            <p className="text-gray-400 text-sm">
              마크다운 기반의 현대적인 블로그 플랫폼입니다.
              <br />
              자유롭게 글을 작성하고 공유하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/posts" className="text-gray-400 hover:text-white">
                  게시글
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">
                  소개
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">
                  문의
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">소셜</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Oz-Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
