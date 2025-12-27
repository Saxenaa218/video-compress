import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white">VideoShare</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-2 text-white hover:text-gray-200 font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            Upload, Share, and Collaborate on Videos
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            The easiest way to upload your videos and share them with embedded links. 
            Request reviews from other users and get feedback on your content.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Start Uploading Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Upload</h3>
            <p className="text-white/80">
              Upload videos in any format. We support MP4, WebM, OGG, and MOV files.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Embed Anywhere</h3>
            <p className="text-white/80">
              Share your videos with unique embed links. Easily embed them on any website.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Request Reviews</h3>
            <p className="text-white/80">
              Collaborate with others by requesting video reviews. Get feedback from peers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-white/60 py-8 mt-20">
        <p>&copy; 2024 VideoShare. All rights reserved.</p>
      </footer>
    </div>
  );
}
