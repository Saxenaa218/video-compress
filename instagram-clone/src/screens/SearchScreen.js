import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const SearchScreen = ({ navigation }) => {
  const { users } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample explore images for the grid
  const exploreImages = [
    'https://picsum.photos/200/200?random=10',
    'https://picsum.photos/200/200?random=11',
    'https://picsum.photos/200/200?random=12',
    'https://picsum.photos/200/200?random=13',
    'https://picsum.photos/200/200?random=14',
    'https://picsum.photos/200/200?random=15',
    'https://picsum.photos/200/200?random=16',
    'https://picsum.photos/200/200?random=17',
    'https://picsum.photos/200/200?random=18',
    'https://picsum.photos/200/200?random=19',
    'https://picsum.photos/200/200?random=20',
    'https://picsum.photos/200/200?random=21',
  ];

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderExploreImage = ({ item, index }) => (
    <TouchableOpacity style={styles.exploreImageContainer}>
      <Image source={{ uri: item }} style={styles.exploreImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#8e8e8e" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8e8e8e"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#8e8e8e" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results or Explore Grid */}
      {searchQuery.length > 0 ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={exploreImages}
          renderItem={renderExploreImage}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#262626',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: '#262626',
  },
  name: {
    fontSize: 14,
    color: '#8e8e8e',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8e8e8e',
    fontSize: 16,
  },
  exploreImageContainer: {
    flex: 1,
    aspectRatio: 1,
    padding: 1,
  },
  exploreImage: {
    width: '100%',
    height: '100%',
  },
});

export default SearchScreen;
