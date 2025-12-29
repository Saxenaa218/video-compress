import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const CommentsScreen = ({ navigation, route }) => {
  const { postId } = route.params;
  const { posts, addComment, user } = useAppContext();
  const [commentText, setCommentText] = useState('');

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Post not found</Text>
      </SafeAreaView>
    );
  }

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      addComment(postId, commentText.trim());
      setCommentText('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentText}>
          <Text style={styles.commentUsername}>{item.user.username}</Text>
          {' '}{item.text}
        </Text>
        <View style={styles.commentActions}>
          <Text style={styles.commentTime}>
            {item.timestamp ? formatTime(item.timestamp) : 'Recently'}
          </Text>
          <TouchableOpacity>
            <Text style={styles.commentReply}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.commentLike}>
        <Ionicons name="heart-outline" size={14} color="#8e8e8e" />
      </TouchableOpacity>
    </View>
  );

  const renderPostPreview = () => (
    <View style={styles.postPreview}>
      <Image source={{ uri: post.user.avatar }} style={styles.postAvatar} />
      <View style={styles.postContent}>
        <Text style={styles.postCaption}>
          <Text style={styles.postUsername}>{post.user.username}</Text>
          {' '}{post.caption}
        </Text>
        <Text style={styles.postTime}>{formatTime(post.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={post.comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderPostPreview}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <Image source={{ uri: user.avatar }} style={styles.inputAvatar} />
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#8e8e8e"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            onPress={handleSubmitComment}
            disabled={!commentText.trim()}
          >
            <Text
              style={[
                styles.postButton,
                !commentText.trim() && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  keyboardView: {
    flex: 1,
  },
  commentsList: {
    paddingBottom: 10,
  },
  postPreview: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
  },
  postCaption: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 20,
  },
  postUsername: {
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
    color: '#8e8e8e',
    marginTop: 6,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 15,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 18,
  },
  commentUsername: {
    fontWeight: '600',
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 6,
  },
  commentTime: {
    fontSize: 12,
    color: '#8e8e8e',
    marginRight: 15,
  },
  commentReply: {
    fontSize: 12,
    color: '#8e8e8e',
    fontWeight: '600',
  },
  commentLike: {
    paddingLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
    backgroundColor: '#fff',
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#262626',
    maxHeight: 80,
  },
  postButton: {
    color: '#0095f6',
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 10,
  },
  postButtonDisabled: {
    color: '#b2dffc',
  },
});

export default CommentsScreen;
