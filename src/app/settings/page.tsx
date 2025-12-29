'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { mockLabels, mockUsers } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type Tab = 'labels' | 'notifications' | 'integrations' | 'team';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('labels');
  const [notificationSettings, setNotificationSettings] = useState({
    issueAssigned: true,
    issueUpdated: true,
    mentions: true,
    comments: true,
    milestoneDue: true,
    emailDigest: false
  });

  return (
    <>
      <Header title="Settings" />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-6">
            {/* Sidebar Navigation */}
            <nav className="w-48 shrink-0">
              <ul className="space-y-1">
                {[
                  { id: 'labels' as Tab, label: 'Labels', icon: '🏷️' },
                  { id: 'notifications' as Tab, label: 'Notifications', icon: '🔔' },
                  { id: 'integrations' as Tab, label: 'Integrations', icon: '🔗' },
                  { id: 'team' as Tab, label: 'Team', icon: '👥' }
                ].map(tab => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'labels' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Labels</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage labels for organizing issues
                      </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <span>+</span>
                      New Label
                    </button>
                  </div>

                  <div className="space-y-3">
                    {mockLabels.map(label => (
                      <div
                        key={label.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{label.name}</p>
                            {label.description && (
                              <p className="text-sm text-gray-500">{label.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Configure when you want to receive notifications
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                      
                      {[
                        { key: 'issueAssigned', label: 'Issue assigned to me', description: 'Get notified when an issue is assigned to you' },
                        { key: 'issueUpdated', label: 'Issue updated', description: 'Get notified when an issue you\'re watching is updated' },
                        { key: 'mentions', label: 'Mentions', description: 'Get notified when someone mentions you' },
                        { key: 'comments', label: 'Comments', description: 'Get notified when someone comments on your issues' },
                        { key: 'milestoneDue', label: 'Milestone due', description: 'Get notified when a milestone is approaching its due date' }
                      ].map(setting => (
                        <label
                          key={setting.key}
                          className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [setting.key]: e.target.checked
                            })}
                            className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{setting.label}</p>
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailDigest}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            emailDigest: e.target.checked
                          })}
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Daily email digest</p>
                          <p className="text-sm text-gray-500">
                            Receive a daily summary of all activity instead of individual notifications
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Connect with your favorite development tools
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* GitHub Integration */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <span className="text-4xl">🐙</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">GitHub</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Connect with GitHub to sync issues, link commits, and automate workflows.
                            </p>
                            <ul className="text-sm text-gray-600 mt-3 space-y-1">
                              <li>• Automatically link commits to issues</li>
                              <li>• Create issues from GitHub</li>
                              <li>• Sync issue status with PR workflow</li>
                            </ul>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                          Connect GitHub
                        </button>
                      </div>
                    </div>

                    {/* GitLab Integration */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <span className="text-4xl">🦊</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">GitLab</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Connect with GitLab to sync issues and integrate with your CI/CD pipeline.
                            </p>
                            <ul className="text-sm text-gray-600 mt-3 space-y-1">
                              <li>• Link merge requests to issues</li>
                              <li>• Import issues from GitLab</li>
                              <li>• Webhook notifications</li>
                            </ul>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                          Connect GitLab
                        </button>
                      </div>
                    </div>

                    {/* Slack Integration */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <span className="text-4xl">💬</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">Slack</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Get notifications in Slack when issues are created or updated.
                            </p>
                            <ul className="text-sm text-gray-600 mt-3 space-y-1">
                              <li>• Real-time notifications</li>
                              <li>• Create issues from Slack</li>
                              <li>• Update issue status via Slack commands</li>
                            </ul>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                          Connect Slack
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage team access and roles
                      </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <span>+</span>
                      Invite Member
                    </button>
                  </div>

                  <div className="space-y-3">
                    {mockUsers.map(user => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <select
                            defaultValue={user.role}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="admin">Admin</option>
                            <option value="developer">Developer</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button className="text-sm text-red-600 hover:text-red-700">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
