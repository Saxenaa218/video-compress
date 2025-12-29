import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserCard = ({ user, onPress, onFriendToggle, showFriendButton = true }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.name}>{user.name}</Text>
      </View>
      {showFriendButton && (
        <TouchableOpacity
          style={[styles.button, user.isFriend && styles.buttonFollowing]}
          onPress={() => onFriendToggle(user.id)}
        >
          <Text style={[styles.buttonText, user.isFriend && styles.buttonTextFollowing]}>
            {user.isFriend ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  avatar: {
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
  button: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonFollowing: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextFollowing: {
    color: '#262626',
  },
});

export default UserCard;
