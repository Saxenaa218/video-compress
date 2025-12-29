import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');
const imageSize = width / 3;

const UserProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const { users, posts, toggleFriend } = useAppContext();
  
  const profileUser = users.find((u) => u.id === userId);
  const userPosts = posts.filter((post) => post.userId === userId);

  if (!profileUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>User not found</Text>
      </SafeAreaView>
    );
  }

  const StatItem = ({ value, label }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.gridImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>{profileUser.username}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profileRow}>
            <Image source={{ uri: profileUser.avatar }} style={styles.profileAvatar} />
            <View style={styles.statsContainer}>
              <StatItem value={profileUser.posts} label="Posts" />
              <StatItem value={profileUser.followers} label="Followers" />
              <StatItem value={profileUser.following} label="Following" />
            </View>
          </View>

          <Text style={styles.profileName}>{profileUser.name}</Text>
          <Text style={styles.profileBio}>{profileUser.bio}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.followButton, profileUser.isFriend && styles.followingButton]}
              onPress={() => toggleFriend(userId)}
            >
              <Text style={[styles.followButtonText, profileUser.isFriend && styles.followingButtonText]}>
                {profileUser.isFriend ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
            <Ionicons name="grid-outline" size={24} color="#262626" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="play-outline" size={24} color="#8e8e8e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="person-outline" size={24} color="#8e8e8e" />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        {userPosts.length > 0 ? (
          <FlatList
            data={userPosts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.postsGrid}
          />
        ) : (
          <View style={styles.noPostsContainer}>
            <Ionicons name="camera-outline" size={60} color="#8e8e8e" />
            <Text style={styles.noPostsText}>No Posts Yet</Text>
          </View>
        )}
      </ScrollView>
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
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
  },
  profileInfo: {
    padding: 15,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
  },
  statLabel: {
    fontSize: 14,
    color: '#262626',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 2,
  },
  profileBio: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#0095f6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  followingButtonText: {
    color: '#262626',
  },
  messageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  noPostsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noPostsText: {
    marginTop: 10,
    fontSize: 18,
    color: '#8e8e8e',
  },
});

export default UserProfileScreen;
