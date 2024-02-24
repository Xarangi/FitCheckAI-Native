// ItemsScreen.js
import React from 'react';
// import OpenAI from 'openai';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");


import { View, Button, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-pro-vision"});

const DATA = [
  { id: '1', title: 'Item 1', description: 'Description of Item 1' },
  { id: '2', title: 'Item 2', description: 'Description of Item 2' },
  { id: '3', title: 'Item 3', description: 'Description of Item 1' },
  { id: '4', title: 'Item 4', description: 'Description of Item 2' },
  { id: '5', title: 'Item 5', description: 'Description of Item 1' },
  { id: '6', title: 'Item 6', description: 'Description of Item 2' },
];

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// async function run() {
//   // For text-and-image input (multimodal), use the gemini-pro-vision model
//   const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

//   const prompt = "Please style my outfit in this image. I want to know what I can add to it! Return the list of suggestions in this format: [  { id: '1', title: 'Item 1', description: 'Description of Item 1' },  { id: '2', title: 'Item 2', description: 'Description of Item 2' },]";

//   const imageParts = [
//     fileToGenerativePart("image1.png", "image/png"),
//   ];

//   const result = await model.generateContent([prompt, ...imageParts]);
//   const response = await result.response;
//   const text = response.text();
//   console.log(text);
// }

export default function ItemsScreen({ navigation }) {
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
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Regenerate" onPress={() => {/* Add logic to regenerate items */}} />

    </View>
  );
}
