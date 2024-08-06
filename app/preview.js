import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import SelectableImage from '../components/SelectableImage';

export default function PreviewScreen() {
  const { photoUri, scaleFactor } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileExists, setFileExists] = useState(false);

  useEffect(() => {
    const checkFile = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(photoUri);
        setFileExists(fileInfo.exists);
        console.log('File exists:', fileInfo.exists);
      } catch (error) {
        setError('Error checking file existence.');
        console.error('File existence check error:', error);
      }
      setLoading(false);
    };

    if (photoUri) {
      checkFile();
    } else {
      setLoading(false);
    }
  }, [photoUri]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = (e) => {
    setLoading(false);
    setError(e.nativeEvent.error);
    console.error('Image loading error:', e.nativeEvent.error);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!photoUri || !fileExists) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No photo URI found or file does not exist.
        </Text>
      </View>
    );
  }

  return <SelectableImage uri={photoUri} scaleFactor={scaleFactor} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'black',
  },
  image: {
    flex: 1,

    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
  },
});
