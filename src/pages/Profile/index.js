import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

import {default as theme} from '../../../theme.json';
import {user_profile} from '../../api/user_api';
import {RefreshControl} from 'react-native-gesture-handler';

const ProfileScreen = ({navigation}) => {
  useEffect(() => {
    getUser();
    const interval = setInterval(() => {
      getUser();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const [user, setUser] = useState({});

  const [isLoading, setLoading] = useState(true);

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
        if (res.status === 200) {
          setUser(res.data.data);
          setLoading(false);
        } else {
          AsyncStorage.clear();
          navigation.replace('Login');
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const data = [
    {
      id: 1,
      image: 'https://img.icons8.com/color/70/000000/administrator-male.png',
      title: 'Update Akun',
      code: 'update',
    },
    {
      id: 2,
      image: 'https://img.icons8.com/color/70/000000/cottage.png',
      title: 'Bahasa',
      code: 'language',
    },
    {
      id: 3,
      image: 'https://img.icons8.com/color/70/000000/filled-like.png',
      title: 'Terms of Service',
      code: 'terms',
    },
    {
      id: 4,
      image: 'https://img.icons8.com/color/70/000000/facebook-like.png',
      title: 'Privacy Policy',
      code: 'privacy',
    },
    {
      id: 5,
      image: 'https://img.icons8.com/color/70/000000/shutdown.png',
      title: 'Logout',
      code: 'logout',
    },
  ];

  const [options, setOptions] = useState(data);

  const handleRefresh = () => {
    setLoading(true);
    getUser();
    setLoading(false);
  };

  const handleFeatures = code => {
    if (code === 'logout') {
      handleLogout();
    } else {
      Alert.alert(code);
      // navigation.navigate(code);
    }
  };

  const ContentThatGoesAboveTheFlatList = () => {
    return (
      <View style={styles.headerContent}>
        <Image
          style={styles.avatar}
          source={{
            uri: 'https://bootdey.com/img/Content/avatar/avatar7.png',
          }}
        />
        <Text style={styles.username}>{user.name}</Text>
        <Text style={styles.accountNumber}>
          ADDRESS : {user.account_number}
        </Text>
      </View>
    );
  };
  const ContentThatGoesBelowTheFlatList = () => {
    return <View style={styles.body}></View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      {/* <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }> */}
      <View>
        {/* <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                style={styles.avatar}
                source={{
                  uri: 'https://bootdey.com/img/Content/avatar/avatar7.png',
                }}
              />
              <Text style={styles.username}>{user.name}</Text>
              <Text style={styles.accountNumber}>
                ADDRESS : {user.account_number}
              </Text>
            </View>
          </View> */}

        <View style={styles.body}>
          <FlatList
            enableEmptySections={true}
            data={options}
            ListHeaderComponent={ContentThatGoesAboveTheFlatList}
            ListFooterComponent={ContentThatGoesBelowTheFlatList}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleFeatures(item.code);
                  }}>
                  <View style={styles.box}>
                    {/* <Image style={styles.icon} source={{uri: item.image}} /> */}
                    <Text style={styles.title}>{item.title}</Text>
                    {/* <Image
                        style={styles.btn}
                        source={{
                          uri: 'https://img.icons8.com/customer/office/40',
                        }}
                      /> */}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
      {/* <TouchableOpacity
        onPress={() => {
          handleLogout();
        }}>
        <Text>Logout</Text>
      </TouchableOpacity> */}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme['color-dark-gray-200'],
  },
  header: {
    backgroundColor: theme['color-dark-gray-200'],
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: theme['color-primary-600'],
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 15,
    color: theme['color-dark-500'],
    marginLeft: 4,
    paddingVertical: 10,
  },
  btn: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
  },
  box: {
    padding: 5,
    marginBottom: 2,
    backgroundColor: theme['color-primary-100'],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  username: {
    color: theme['color-dark-500'],
    fontSize: 21,
    alignSelf: 'center',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  accountNumber: {
    color: theme['color-dark-gray-400'],
    fontSize: 15,
    alignSelf: 'center',
    marginLeft: 10,
    backgroundColor: theme['color-primary-200'],
    // padding: 1,
    // fontWeight: 'bold',
  },
});

export default ProfileScreen;
