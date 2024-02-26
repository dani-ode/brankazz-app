import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const ProfileScreen = ({navigation}) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <View>
      <Text>Profile</Text>
      <TouchableOpacity
        onPress={() => {
          handleLogout();
        }}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
