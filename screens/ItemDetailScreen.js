// ItemDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

export default function ItemDetailScreen({ route }) {
  const { item } = route.params;
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.titleText}>{item.title}</Text>
      <Text style={GlobalStyles.bodyText}>{item.description}</Text>
    </View>
  );
}
