import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import {user_profile, user_update_profile} from '../../api/user_api';

import {default as theme} from '../../../theme.json';
import {Bounce} from 'react-native-animated-spinkit';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const EditProfile = () => {
  useEffect(() => {
    getUser();

    // const interval = setInterval(() => {
    // getUser();
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);

  const [user, setUser] = useState({});

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileImg, setProfileImg] = useState(user.profile_img);
  const [role, setRole] = useState(user.role);

  const [isLoading, setLoading] = useState(true);

  const [selectImage, setSelectImage] = useState(null);

  const getUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('user-id');
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      if (!userId || !userKey || !userBearerToken) {
        await AsyncStorage.clear();
        navigation.replace('Login');
      }

      await user_profile(userId, userKey, userBearerToken).then(res => {
        if (res) {
          if (res.status === 200) {
            setUser(res.data.data);
            // console.log(res.data.data);
            setEmail(res.data.data.email);
            setName(res.data.data.name);
            setProfileImg(res.data.data.profile_img);
            setRole(res.data.data.role);
            setLoading(false);
          } else {
            handleLogout();
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('user-id');
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');
      const userRole = role;

      if (!userId || !userKey || !userBearerToken) {
        await AsyncStorage.clear();
        navigation.replace('Login');
      }

      if (name.length < 3 || email.length < 3) {
        setLoading(false);
        Alert.alert('Gagal', 'Mohon lengkapi semua kolom dengan benar');
        return;
      }

      console.log(userRole, name, email, selectImage ?? profileImg);
      await user_update_profile(
        userId,
        userKey,
        userBearerToken,
        userRole,
        name,
        email,
        selectImage ?? profileImg,
      ).then(res => {
        setLoading(false);
        if (res) {
          if (res.status == 201) {
            setUser(res.data.data);
            // console.log(res.data.data);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageSelect = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    await launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        setSelectImage(source.uri);
        setProfileImg(source.uri);

        console.log('response : ', response.assets[0]);
        console.log(source);
      }
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImageSelect}>
            {profileImg || selectImage ? (
              selectImage == null ? (
                <Image source={{uri: profileImg}} style={styles.image} />
              ) : (
                <Image source={{uri: selectImage}} style={styles.image} />
              )
            ) : (
              <Text style={styles.selectText}>Select Image</Text>
            )}

            {/* <Text style={styles.selectText}>Select Image</Text>
          <Text style={styles.selectText}>Select Image</Text> */}
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Nama :</Text>
        <TextInput
          style={styles.input}
          value={name ?? user.name}
          onChangeText={setName ?? user.name}
          placeholder="Enter your name"
        />
        <Text style={styles.label}>Email :</Text>
        <TextInput
          style={styles.input}
          value={email ?? user.email}
          onChangeText={setEmail ?? user.email}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        {/* <Button style={styles.button} title="Save" onPress={handleSave} /> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            //   setEmail(email);
            //   setName(name);
            //   setProfileImg(profileImg);
            handleSave();
          }}>
          <Text style={{color: theme['color-secondary-800']}}>Save</Text>
        </TouchableOpacity>
      </View>
      <Bounce
        size={48}
        color={theme['color-secondary-500']}
        style={[styles.spinkitLoader, {display: isLoading ? 'flex' : 'none'}]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  spinkitLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme['color-dark-500'],
    opacity: 0.7,
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  selectText: {
    color: theme['color-primary-600'],
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme['color-primary-800'],
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 20,
    height: 50,
    color: theme['color-primary-800'],
  },
  button: {
    backgroundColor: theme['color-secondary-500'],
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    height: 40,
    borderColor: theme['color-secondary-600'],
    borderWidth: 1,
  },
});

export default EditProfile;
