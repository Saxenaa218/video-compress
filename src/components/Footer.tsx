import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 md:px-12 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Social links */}
        <div className="flex gap-6 mb-8">
          <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
            <Facebook size={24} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
            <Instagram size={24} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
            <Youtube size={24} />
          </a>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-2">
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Audio Description
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Help Center
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Gift Cards
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Media Center
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Investor Relations
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Jobs
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Terms of Use
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Privacy
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Legal Notices
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Cookie Preferences
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Corporate Information
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Contact Us
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Speed Test
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Legal Guarantee
            </Link>
            <Link href="#" className="hover:text-white transition-colors text-sm">
              Only on Streamix
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm">
            © {new Date().getFullYear()} Streamix. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            Movie data provided by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
