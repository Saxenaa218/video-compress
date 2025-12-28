"use client";

import { signOut } from "next-auth/react";
import MainLayout from "@/components/layout/MainLayout";
import { LogOut, User, Lock, Bell, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <SettingsItem
            icon={<User size={20} />}
            label="Edit profile"
            href="/accounts/edit"
          />
          <SettingsItem
            icon={<Lock size={20} />}
            label="Change password"
            href="#"
          />
          <SettingsItem
            icon={<Bell size={20} />}
            label="Push notifications"
            href="#"
          />
          <SettingsItem
            icon={<Shield size={20} />}
            label="Privacy and security"
            href="#"
          />
          <SettingsItem
            icon={<HelpCircle size={20} />}
            label="Help"
            href="#"
          />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 transition-colors text-red-500"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

function SettingsItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
