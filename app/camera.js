import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';
import CameraOverlay from '../components/CameraOverlay';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function camera() {
  // Camera ref
  const cameraRef = useRef(null);
  // Local state
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState('off');
  const [zoom, setZoom] = useState(0);
  const [torchMode, setTorchMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHandlingCloudflareErr, setIsHandlingCloudflareErr] = useState(false);
  // Make sure is processing false when reloading page
  useEffect(() => {
    setIsProcessing(false);
  }, []);

  // Handle permissions
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleTorchMode = () => {
    setTorchMode((current) => !current);
  };

  // Take picture
  const takePicture = async () => {
    setIsProcessing(true);

    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
        });
        processAndContinue(photo.uri);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Select image from device
  const uplaodFromDevice = async () => {
    setIsProcessing(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        processAndContinue(uri);
      } else {
        setIsProcessing(false);
      }
    } catch (err) {
      setIsProcessing(false);
      console.log(err);
    }
  };

  const processAndContinue = async (uri) => {
    setIsProcessing(true);
    try {
      // Resize and compress the image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1600, height: 1600 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Get the file info
      const fileInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);

      // Check if the file size is still too large (over 10MB)
      if (fileInfo.size > 10 * 1024 * 1024) {
        console.warn('Image is too large, compressing further');
        const furtherCompressedImage = await ImageManipulator.manipulateAsync(
          manipulatedImage.uri,
          [],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
        manipulatedImage.uri = furtherCompressedImage.uri;
      }

      // Copy the processed image to local file system
      const destinationUri = `${
        FileSystem.documentDirectory
      }${manipulatedImage.uri.split('/').pop()}`;
      await FileSystem.copyAsync({
        from: manipulatedImage.uri,
        to: destinationUri,
      });
      console.log('Processed photo copied to:', destinationUri);

      // Read the image as base64
      const base64Data = await FileSystem.readAsStringAsync(destinationUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send to your API
      const response = await fetch(
        'https://bill-splitter.dorplaut.workers.dev/api/analyze-image',

        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data }),
        }
      );

      const data = await response.json();
      if (typeof data.jsonObject === 'object') {
        setIsProcessing(false);
        router.push({
          pathname: '/split',
          params: { data: JSON.stringify(data.jsonObject) },
        });
      } else {
        setIsProcessing(false);
        console.warn('Unexpected response from API');
      }
    } catch (error) {
      handleCloudflareWorkerError(base64Data);
      console.error('Error processing image:', error);
    }
  };

  // handle when cloudfalre worker run from a country unsuported by google gemini
  const handleCloudflareWorkerError = async (image) => {
    // show massage letting the user know fast server not avialbe and the process might take a bit.
    setIsHandlingCloudflareErr(true);
    //  try again but from Render servers
    try {
      // Send to your API
      const response = await fetch(
        'https://bill-processing-api.onrender.com/api/analyze-image',

        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: image }),
        }
      );

      const data = await response.json();
      if (typeof data.jsonObject === 'object') {
        setIsProcessing(false);
        router.push({
          pathname: '/split',
          params: { data: JSON.stringify(data.jsonObject) },
        });
      } else {
        setIsProcessing(false);
        console.warn('Unexpected response from API');
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          {isHandlingCloudflareErr && (
            <Text style={styles.loadingText}>
              Servers currently unavailable, please wait or try again in a
              minute.
            </Text>
          )}
        </View>
      )}
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        flash={flashMode}
        zoom={zoom}
        enableTorch={torchMode}
      >
        <CameraOverlay />
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleTorchMode}
          >
            <Ionicons
              name={torchMode ? 'flash' : 'flash-off'}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner}>
              <Ionicons
                name="checkmark-circle-outline"
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraFacing}
          >
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.upperControlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={uplaodFromDevice}
          >
            <Feather name="upload" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  controls: {
    zIndex: 2,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
  },
  controlButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  controlText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  zoomSlider: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  //
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  upperControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(76, 175, 80,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
