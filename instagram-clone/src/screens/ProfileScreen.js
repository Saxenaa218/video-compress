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

const ProfileScreen = ({ navigation, route }) => {
  const { user, posts } = useAppContext();
  
  // Use current user if no userId is provided
  const profileUser = user;
  const userPosts = posts.filter((post) => post.userId === profileUser.id);

  // Sample posts for grid (using random images since current user may not have posts)
  const samplePosts = [
    { id: '1', image: 'https://picsum.photos/200/200?random=30' },
    { id: '2', image: 'https://picsum.photos/200/200?random=31' },
    { id: '3', image: 'https://picsum.photos/200/200?random=32' },
    { id: '4', image: 'https://picsum.photos/200/200?random=33' },
    { id: '5', image: 'https://picsum.photos/200/200?random=34' },
    { id: '6', image: 'https://picsum.photos/200/200?random=35' },
  ];

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
        <TouchableOpacity>
          <Ionicons name="lock-closed-outline" size={16} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>{profileUser.username}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="add-circle-outline" size={26} color="#262626" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="menu-outline" size={26} color="#262626" />
          </TouchableOpacity>
        </View>
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

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Story Highlights */}
        <View style={styles.highlightsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.highlightItem}>
              <View style={styles.highlightAdd}>
                <Ionicons name="add" size={30} color="#262626" />
              </View>
              <Text style={styles.highlightText}>New</Text>
            </TouchableOpacity>
          </ScrollView>
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
        <FlatList
          data={userPosts.length > 0 ? userPosts : samplePosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.postsGrid}
        />
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
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 15,
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
  editButton: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
  },
  highlightsContainer: {
    paddingVertical: 15,
    paddingLeft: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  highlightAdd: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  highlightText: {
    fontSize: 12,
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
});

export default ProfileScreen;
