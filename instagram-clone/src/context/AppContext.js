import React, { createContext, useContext, useState } from 'react';
import { posts as initialPosts, users as initialUsers, currentUser } from '../data/mockData';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [users, setUsers] = useState(initialUsers);
  const [user] = useState(currentUser);

  const addPost = (newPost) => {
    const post = {
      id: String(Date.now()),
      userId: user.id,
      user: user,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      isLiked: false,
      ...newPost,
    };
    setPosts([post, ...posts]);
  };

  const likePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const addComment = (postId, text) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { id: String(Date.now()), user: user, text },
          ],
        };
      }
      return post;
    }));
  };

  const toggleFriend = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, isFriend: !u.isFriend };
      }
      return u;
    }));
  };

  const getFriends = () => {
    return users.filter(u => u.isFriend);
  };

  const getSuggestedUsers = () => {
    return users.filter(u => !u.isFriend);
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        users,
        user,
        addPost,
        likePost,
        addComment,
        toggleFriend,
        getFriends,
        getSuggestedUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
