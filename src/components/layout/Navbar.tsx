"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!session) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[245px] border-r border-gray-200 bg-white flex-col p-3">
        <Link href="/" className="px-3 py-6 mb-4">
          <h1 className="text-2xl font-semibold">Instagram</h1>
        </Link>

        <div className="flex flex-col gap-1 flex-1">
          <NavItem href="/" icon={<Home size={24} />} label="Home" />
          <NavItem href="/search" icon={<Search size={24} />} label="Search" />
          <NavItem href="/messages" icon={<MessageCircle size={24} />} label="Messages" />
          <NavItem href="/notifications" icon={<Heart size={24} />} label="Notifications" />
          <NavItem href="/create" icon={<PlusSquare size={24} />} label="Create" />
          <NavItem
            href={`/profile/${session.user.username}`}
            icon={
              session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <User size={24} />
              )
            }
            label="Profile"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-4 p-3 w-full rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} />
            <span className="text-base">More</span>
          </button>

          {showDropdown && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-3 p-4 w-full hover:bg-gray-100 transition-colors text-left"
              >
                <LogOut size={20} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-14">
          <Link href="/" className="p-2">
            <Home size={24} />
          </Link>
          <Link href="/search" className="p-2">
            <Search size={24} />
          </Link>
          <Link href="/create" className="p-2">
            <PlusSquare size={24} />
          </Link>
          <Link href="/notifications" className="p-2">
            <Heart size={24} />
          </Link>
          <Link href={`/profile/${session.user.username}`} className="p-2">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <User size={24} />
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex justify-between items-center h-14 px-4">
          <Link href="/">
            <h1 className="text-xl font-semibold">Instagram</h1>
          </Link>
          <div className="flex gap-4">
            <Link href="/messages">
              <MessageCircle size={24} />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors"
    >
      {icon}
      <span className="text-base">{label}</span>
    </Link>
  );
}
