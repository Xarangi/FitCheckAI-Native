import {API_KEY} from '@env';
import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
const { GoogleGenerativeAI } = require("@google/generative-ai");
import GlobalStyles from '../styles/GlobalStyles';

const genAI = new GoogleGenerativeAI(API_KEY);

function fileToGenerativePart(image64, mimeType) {
  return {
    inlineData: {
      data: image64,
      mimeType
    },
  };
}

export default function ItemsScreen({ route, navigation }) {
  const { imageBase64 } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(userStyles = '') {
    setIsLoading(true);
    try {
      // Modify the prompt based on user input if available
      const specificPrompt = userStyles ? `Please style my outfit in this image with these styles: ${userStyles}. ` : 'Please style my outfit in this image.';
      const prompt = specificPrompt + "I want to know what I can add to this outfit specifically. So be detailed with specific information such as colors, and say what part of my outfit I should change or add it to. Return the list of suggestions in a json format with an id, title, and description fields. Ensure there are no other words or characters outside the format. NO backticks, and ensure the input starts with a square bracket";

      const resultText = await run(imageBase64, prompt); // Pass the updated prompt here
      const resultData = JSON.parse(resultText);
      setData(resultData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Assuming run function is updated to accept the prompt as an argument
  async function run(imageBase64, prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const imageParts = [fileToGenerativePart(imageBase64, "image/jpeg")];
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();
    return text;
  }

  // renderItem function definition
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={GlobalStyles.listItem}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    >
      <Text style={GlobalStyles.listItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={GlobalStyles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Regenerate" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ScrollView 
          contentContainerStyle={styles.centeredView} // Use contentContainerStyle for child layout properties
          style={{ flex: 1 }} // Other styles affecting the ScrollView itself can still go here
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Let's get specific!</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUserInput}
              value={userInput}
              placeholder="Input styles you want to try"
            />
            <Button
              title="Submit"
              onPress={() => {
                fetchData(userInput); // Use the user input to fetch data
                setModalVisible(!modalVisible);
                setUserInput(''); // Clear user input after submitting
              }}
            />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles for the modal and input here
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});
