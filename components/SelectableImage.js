import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const SelectableImage = ({ uri, scaleFactor }) => {
  const [selection, setSelection] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { moveX, moveY, x0, y0 } = gestureState;
        const newSelection = {
          x: Math.min(x0, moveX),
          y: Math.min(y0, moveY),
          width: Math.abs(moveX - x0),
          height: Math.abs(moveY - y0),
        };
        setSelection(newSelection);
      },
      onPanResponderRelease: () => {
        // Finalize selection
      },
    })
  ).current;

  const handleComplete = async () => {
    if (!selection) {
      setError('Please select an area of the image first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    // const offSet = scaleFactor * scaleFactor;
    try {
      // const croppedImage = await ImageManipulator.manipulateAsync(
      //   uri,
      //   [
      //     {
      //       crop: {
      //         originX: selection.x * scaleFactor,
      //         originY: selection.y * scaleFactor - offSet,
      //         width: selection.width * scaleFactor,
      //         height: selection.height * scaleFactor,
      //       },
      //     },
      //   ],
      //   { format: 'jpeg' }
      // );
      // const resizedImage = await ImageManipulator.manipulateAsync(
      //   croppedImage.uri,
      //   [
      //     {
      //       resize: {
      //         width: selection.width * 3,
      //         height: selection.height * 3,
      //       },
      //     },
      //   ],
      //   { format: 'jpeg' }
      // );

      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(
        'http://192.168.1.22:3000/api/analyze-image',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data }),
        }
      );

      const data = await response.json();

      if (typeof data.jsonObject === 'object') {
        router.push({
          pathname: '/split',
          params: { data: JSON.stringify(data.jsonObject) },
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(
        'An error occurred while processing the image. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer} {...panResponder.panHandlers}>
        <Image source={{ uri }} style={styles.image} />
        {selection && (
          <View
            style={[
              styles.selection,
              {
                top: selection.y,
                left: selection.x,
                width: selection.width,
                height: selection.height,
              },
            ]}
          />
        )}
      </View>

      <View style={styles.overlay}>
        <Text style={styles.instructionText}>
          Select the area containing items and total bill
        </Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="white"
              />
              <Text style={styles.buttonText}>Process Receipt</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  selection: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SelectableImage;
