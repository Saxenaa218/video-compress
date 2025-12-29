import React from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import PostCard from '../components/PostCard';
import StoryCircle from '../components/StoryCircle';
import { stories } from '../data/mockData';

const HomeScreen = ({ navigation }) => {
  const { posts, user } = useAppContext();

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.logo}>Instagram</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="heart-outline" size={26} color="#262626" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#262626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStories = () => (
    <View style={styles.storiesContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContent}
      >
        {/* Your Story */}
        <View style={styles.yourStory}>
          <View style={styles.yourStoryCircle}>
            <StoryCircle user={user} hasStory={false} onPress={() => {}} />
            <View style={styles.addStoryButton}>
              <Ionicons name="add-circle" size={20} color="#0095f6" />
            </View>
          </View>
        </View>
        
        {/* Other Stories */}
        {stories.map((story) => (
          <StoryCircle
            key={story.id}
            user={story.user}
            hasStory={story.hasStory}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderPost = ({ item }) => (
    <PostCard
      post={item}
      onCommentPress={() => navigation.navigate('Comments', { postId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderStories}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#262626',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 20,
  },
  storiesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
    paddingVertical: 10,
  },
  storiesContent: {
    paddingHorizontal: 10,
  },
  yourStory: {
    position: 'relative',
  },
  yourStoryCircle: {
    position: 'relative',
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default HomeScreen;
