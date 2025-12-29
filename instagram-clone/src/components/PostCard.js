import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const PostCard = ({ post, onCommentPress }) => {
  const { likePost } = useAppContext();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.timestamp}>{formatTime(post.timestamp)}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#262626" />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <Image source={{ uri: post.image }} style={styles.postImage} />

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={() => likePost(post.id)} style={styles.actionButton}>
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={post.isLiked ? '#ED4956' : '#262626'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onCommentPress} style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#262626" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={24} color="#262626" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={styles.likes}>{post.likes.toLocaleString()} likes</Text>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>{post.user.username}</Text>
          {' '}{post.caption}
        </Text>
      </View>

      {/* Comments Preview */}
      {post.comments.length > 0 && (
        <TouchableOpacity onPress={onCommentPress}>
          <Text style={styles.viewComments}>
            View all {post.comments.length} comments
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: '#262626',
  },
  timestamp: {
    fontSize: 11,
    color: '#8e8e8e',
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  likes: {
    fontWeight: '600',
    paddingHorizontal: 12,
    marginBottom: 6,
    color: '#262626',
  },
  captionContainer: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  caption: {
    fontSize: 14,
    color: '#262626',
  },
  captionUsername: {
    fontWeight: '600',
  },
  viewComments: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    color: '#8e8e8e',
    fontSize: 14,
  },
});

export default PostCard;
