"use client";

import MainLayout from "@/components/layout/MainLayout";
import Stories from "@/components/stories/Stories";
import Feed from "@/components/posts/Feed";

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-[470px] mx-auto py-8 px-4">
        <Stories />
        <Feed />
      </div>
    </MainLayout>
  );
}
