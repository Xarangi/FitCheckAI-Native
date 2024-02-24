import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';

const { width } = Dimensions.get('window'); // Get the width of the device screen

export default function HomeScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [imageBase64, setImageBase64] = useState('');


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={() => setImageUri(null)}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Items',{ imageBase64: imageBase64 })}>
              <Text style={styles.text}>Style Me</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={(ref) => setCameraRef(ref)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={async () => {
                if (cameraRef) {
                  let photo = await cameraRef.takePictureAsync({
                    base64: true,
                  });
                  setImageUri(photo.uri);
                  const imageBase64 = photo.base64;
                    // Assuming you have a state to hold the base64 string
                  setImageBase64(imageBase64);
                }
              }}>
              <Text style={styles.text}> Snap </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end', // Align children to the bottom
    alignItems: 'center', // Center children horizontally
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center', // Ensure the button is centered in this container
    alignItems: 'center',
    marginBottom: 30, // Add some space from the bottom edge
  },
  optionsContainer: {
    position: 'absolute', // Position the buttons over the image
    bottom: 50, // Distance from the bottom
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    width: '100%', // Ensure the container spans the width of the screen
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 50, // Circular shape
    height: 70, // Increase for a larger button
    width: 70, // Keep width and height equal for a circle
    shadowColor: '#000', // Shadow for a more tactile look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5, // Elevation for Android to add shadow
  },
  optionButton: {
    alignItems: 'center',
    backgroundColor: '#6200EE',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10, // Space between buttons
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  preview: {
    width: width, // Set the width to the device's width
    height: '100%', // Set the height to fill the container
  },
});
