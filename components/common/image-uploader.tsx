import { moderateScale } from '@/newLib/responsive';
import { uploadApi } from '@/services/api/upload';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from './icon';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onUpload: (url: string) => void;
  containerStyle?: any;
}

const ImageUploader = ({ label, value, onUpload, containerStyle }: ImageUploaderProps) => {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: launchCamera
        },
        {
          text: "Gallery",
          onPress: pickImage
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    )
  };

  const launchCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadImage = async (uri: string) => {
    setLoading(true);
    try {
        const url = await uploadApi.uploadFile(uri);
        onUpload(url);
    } catch (error) {
        Alert.alert("Error", "Failed to upload image");
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
        {loading ? (
          <ActivityIndicator color="black" />
        ) : value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="Edit" size={moderateScale(24)} color="primary" />
            <Text style={styles.placeholderText}>Upload</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateScale(15),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginBottom: moderateScale(8),
    color: '#333',
  },
  touchable: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  placeholderText: {
    fontSize: moderateScale(12),
    color: '#666',
  },
});
