// ItemsScreen.js
import React, { useState, useEffect } from 'react';
import {API_KEY} from '@env';
import { View, Button, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import OpenAI from 'openai';
const { GoogleGenerativeAI } = require("@google/generative-ai");

import GlobalStyles from '../styles/GlobalStyles';

console.log(API_KEY)
const genAI = new GoogleGenerativeAI(API_KEY);


// [{ id: '1', title: 'A solid-colored T-shirt', description: 'A solid-colored T-shirt can be a versatile addition to any outfit. It can be dressed up or down, and it can be paired with a variety of other items.' }, 
// { id: '2', title: 'A pair of sneakers', description: 'A pair of sneakers can add a casual touch to any outfit. They can be paired with jeans, shorts, or even a dress.' }, 
// { id: '3', title: 'A watch', description: 'A watch can add a touch of sophistication to any outfit. It can also be a useful accessory.' }, 
// { id: '4', title: 'A pair of sunglasses', description: 'A pair of sunglasses can protect your eyes from the sun and they can also add a touch of style to any outfit.' }]

function fileToGenerativePart(image64, mimeType) {
  return {
    inlineData: {
      data: image64,
      mimeType
    },
  };
}

async function run(imageBase64) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = "Please style my outfit in this image. I want to know what I can add to it! Return the list of suggestions in a json format with an id, title, and description fields. Ensure there are no other words or characters outside the format (Do not include backticks or the word JSON. Include surrounding square brackets. The titles should mention only the item, and the description should have the reasoning behind why you suggested it and be descriptive.";

  const imageParts = [
    fileToGenerativePart(imageBase64, "image/jpeg"),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text)
  return text;
}

export default function ItemsScreen({ route,navigation }) {
  const { imageBase64 } = route.params;
  // console.log(imageBase64)
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      // Assuming run() is adapted to accept imageBase64 as an argument
      const resultText = await run(imageBase64); // Use imageBase64 here
      const resultData = JSON.parse(resultText); // Convert string to array of objects
      setData(resultData); // Update state with the parsed data
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <View style={GlobalStyles.centered}>
        <Text>Please Wait...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={GlobalStyles.listItem}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    >
      <Text style={GlobalStyles.listItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Regenerate" onPress={() => {fetchData}} />

    </View>
  );
}
