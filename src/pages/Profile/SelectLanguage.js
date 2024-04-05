import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {Card} from '@ui-kitten/components';

import {default as theme} from '../../../theme.json';

const SelectLanguage = ({navigation}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = language => {
    setSelectedLanguage(language);
    // You can perform any additional actions here, such as saving the selected language to AsyncStorage or a state management system
    // For simplicity, I'm just navigating back to the previous screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={{margin: 20, padding: 20}}>
        <Text
          style={{
            fontSize: 13,
            marginBottom: 10,
            color: theme['color-dark-400'],
          }}>
          Bahasa Tersedia :
        </Text>
        <TouchableOpacity
          style={[styles.languageButton]}
          onPress={() => console.log('Indonesia')}>
          <Text style={styles.languageText}>Bahasa Indonesia</Text>
        </TouchableOpacity>
        {/* Add more TouchableOpacity components for other languages as needed */}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: theme['color-primary-200'],
  },
  languageButton: {
    // width: '80%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedLanguage: {
    backgroundColor: 'blue', // Example of styling for selected language
  },

  languageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme['color-dark-400'],
  },
});

export default SelectLanguage;
