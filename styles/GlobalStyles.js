// styles/GlobalStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB', // Light gray background
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827', // Almost black
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    color: '#6B7280', // Dark gray
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: '#FFFFFF', // White
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  listItemText: {
    fontSize: 18,
    color: '#111827',
  },
  button: {
    backgroundColor: '#4F46E5', // Indigo
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
