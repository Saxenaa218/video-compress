'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Video {
  id: string;
  title: string;
  embedId: string;
  embedUrl: string;
  createdAt: string;
}

interface ReviewRequest {
  id: string;
  videoId: string;
  videoTitle: string;
  videoEmbedUrl: string | null;
  requesterName: string;
  requesterEmail: string;
  reviewerName: string;
  reviewerEmail: string;
  message: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [sentRequests, setSentRequests] = useState<ReviewRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ReviewRequest[]>([]);
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Upload form state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Review request form state
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  // Copied link state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Fetch current user
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      // Fetch videos
      const videosRes = await fetch('/api/videos');
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setVideos(videosData.videos);
      }

      // Fetch review requests
      const requestsRes = await fetch('/api/review-requests');
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setSentRequests(requestsData.sent);
        setReceivedRequests(requestsData.received);
      }

      // Fetch other users for review requests
      const usersRes = await fetch('/api/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setOtherUsers(usersData.users);
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !videoTitle) return;

    setUploadLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', videoTitle);

      const res = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      setSuccess('Video uploaded successfully!');
      setVideoTitle('');
      setVideoFile(null);
      fetchData();
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRequestReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoId || !reviewerEmail) return;

    setRequestLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/review-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: selectedVideoId,
          reviewerEmail,
          message: reviewMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send review request');
        return;
      }

      setSuccess('Review request sent successfully!');
      setSelectedVideoId('');
      setReviewerEmail('');
      setReviewMessage('');
      fetchData();
    } catch {
      setError('Failed to send review request. Please try again.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/review-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch {
      setError('Failed to update request status');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const res = await fetch(`/api/videos?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccess('Video deleted successfully');
        fetchData();
      }
    } catch {
      setError('Failed to delete video');
    }
  };

  const copyEmbedLink = async (embedUrl: string, videoId: string) => {
    const fullUrl = `${window.location.origin}${embedUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(videoId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyIframeCode = async (embedUrl: string, title: string) => {
    const fullUrl = `${window.location.origin}${embedUrl}`;
    const iframeCode = `<iframe src="${fullUrl}" width="640" height="360" style="border:0" allowfullscreen title="${title}"></iframe>`;
    await navigator.clipboard.writeText(iframeCode);
    setSuccess('Iframe code copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">VideoShare Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
            <button onClick={() => setSuccess('')} className="float-right">&times;</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Video Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload Video</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Video Title
                </label>
                <input
                  id="videoTitle"
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter video title"
                  required
                />
              </div>
              <div>
                <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Video File
                </label>
                <input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-gray-600 dark:file:text-gray-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploadLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {uploadLoading ? 'Uploading...' : 'Upload Video'}
              </button>
            </form>
          </div>

          {/* Request Review Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Request Video Review</h2>
            {videos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Upload a video first to request reviews.</p>
            ) : otherUsers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No other users available to request reviews from.</p>
            ) : (
              <form onSubmit={handleRequestReview} className="space-y-4">
                <div>
                  <label htmlFor="selectVideo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Video
                  </label>
                  <select
                    id="selectVideo"
                    value={selectedVideoId}
                    onChange={(e) => setSelectedVideoId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a video</option>
                    {videos.map((video) => (
                      <option key={video.id} value={video.id}>
                        {video.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="reviewerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reviewer Email
                  </label>
                  <select
                    id="reviewerEmail"
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a reviewer</option>
                    {otherUsers.map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="reviewMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message (optional)
                  </label>
                  <textarea
                    id="reviewMessage"
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Add a message for the reviewer..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={requestLoading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {requestLoading ? 'Sending...' : 'Send Review Request'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* My Videos Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Videos</h2>
          {videos.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No videos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div key={video.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">{video.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => copyEmbedLink(video.embedUrl, video.id)}
                      className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded"
                    >
                      {copiedId === video.id ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={() => copyIframeCode(video.embedUrl, video.title)}
                      className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded"
                    >
                      Copy Iframe
                    </button>
                    <a
                      href={video.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Requests Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sent Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sent Review Requests</h2>
            {sentRequests.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No sent review requests.</p>
            ) : (
              <div className="space-y-4">
                {sentRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{request.videoTitle}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">To: {request.reviewerName}</p>
                        {request.message && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">&quot;{request.message}&quot;</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Received Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Received Review Requests</h2>
            {receivedRequests.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No received review requests.</p>
            ) : (
              <div className="space-y-4">
                {receivedRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{request.videoTitle}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">From: {request.requesterName}</p>
                        {request.message && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">&quot;{request.message}&quot;</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.videoEmbedUrl && (
                        <a
                          href={request.videoEmbedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded"
                        >
                          Watch Video
                        </a>
                      )}
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateRequestStatus(request.id, 'accepted')}
                          className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded"
                        >
                          Accept
                        </button>
                      )}
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateRequestStatus(request.id, 'completed')}
                          className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
