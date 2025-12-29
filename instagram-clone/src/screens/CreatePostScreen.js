import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../context/AppContext';

const CreatePostScreen = ({ navigation }) => {
  const { addPost, user } = useAppContext();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (!image) {
      Alert.alert('Image Required', 'Please select an image for your post.');
      return;
    }

    addPost({
      image: image,
      caption: caption.trim(),
    });

    setCaption('');
    setImage(null);
    Alert.alert('Success', 'Your post has been shared!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#262626" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity onPress={handlePost}>
            <Text style={styles.shareButton}>Share</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Image Selection */}
          <View style={styles.imageSection}>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={60} color="#8e8e8e" />
                <Text style={styles.placeholderText}>Select an image</Text>
              </View>
            )}
          </View>

          {/* Image Selection Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="images-outline" size={24} color="#0095f6" />
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color="#0095f6" />
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {/* Caption Input */}
          <View style={styles.captionSection}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor="#8e8e8e"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={2200}
            />
          </View>

          {/* Additional Options */}
          <View style={styles.optionsSection}>
            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="location-outline" size={24} color="#262626" />
              <Text style={styles.optionText}>Add location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem}>
              <Ionicons name="person-add-outline" size={24} color="#262626" />
              <Text style={styles.optionText}>Tag people</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
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
  shareButton: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    padding: 20,
    alignItems: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imagePlaceholder: {
    width: 300,
    height: 300,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 10,
    color: '#8e8e8e',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#0095f6',
    borderRadius: 8,
  },
  imageButtonText: {
    marginLeft: 8,
    color: '#0095f6',
    fontWeight: '600',
  },
  captionSection: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  captionInput: {
    flex: 1,
    fontSize: 16,
    color: '#262626',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsSection: {
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#262626',
  },
});

export default CreatePostScreen;
