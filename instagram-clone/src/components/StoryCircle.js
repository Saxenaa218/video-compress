import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StoryCircle = ({ user, hasStory, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {hasStory ? (
        <View style={styles.gradientBorder}>
          <View style={styles.innerBorder}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
        </View>
      ) : (
        <View style={styles.normalBorder}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>
      )}
      <Text style={styles.username} numberOfLines={1}>
        {user.username.length > 10 ? user.username.substring(0, 10) + '...' : user.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
  },
  gradientBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#E1306C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBorder: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  normalBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  username: {
    marginTop: 5,
    fontSize: 12,
    color: '#262626',
    textAlign: 'center',
  },
});

export default StoryCircle;
