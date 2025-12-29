import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import UserCard from '../components/UserCard';

const FriendsScreen = ({ navigation }) => {
  const { getFriends, getSuggestedUsers, toggleFriend } = useAppContext();

  const friends = getFriends();
  const suggestedUsers = getSuggestedUsers();

  const renderSectionHeader = (title, icon) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color="#262626" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderFriend = ({ item }) => (
    <UserCard
      user={item}
      onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
      onFriendToggle={toggleFriend}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity>
          <Ionicons name="person-add-outline" size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        ListHeaderComponent={
          <>
            {/* Following Section */}
            {friends.length > 0 && (
              <View style={styles.section}>
                {renderSectionHeader('Following', 'people')}
                {friends.map((friend) => (
                  <UserCard
                    key={friend.id}
                    user={friend}
                    onPress={() => navigation.navigate('UserProfile', { userId: friend.id })}
                    onFriendToggle={toggleFriend}
                  />
                ))}
              </View>
            )}

            {/* Suggestions Section */}
            <View style={styles.section}>
              {renderSectionHeader('Suggestions For You', 'sparkles')}
              <Text style={styles.suggestionSubtext}>
                People you might know
              </Text>
              {suggestedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
                  onFriendToggle={toggleFriend}
                />
              ))}
            </View>
          </>
        }
        renderItem={null}
        ListEmptyComponent={null}
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
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
  },
  section: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#dbdbdb',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginLeft: 10,
  },
  suggestionSubtext: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: '#8e8e8e',
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
});

export default FriendsScreen;
