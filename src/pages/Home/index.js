import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
} from 'react-native';

import {Layout, Text, Card} from '@ui-kitten/components';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {user_profile} from '../../api/user_api';
import React, {useEffect, useState} from 'react';

import {default as theme} from '../../../theme.json';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RefreshControl} from 'react-native-gesture-handler';

const HomeScreen = () => {
  useEffect(() => {
    getUser();
    const interval = setInterval(() => {
      getUser();
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const navigation = useNavigation();

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
        if (res) {
          if (res.status === 200) {
            setUser(res.data.data);
            setLoading(false);
          } else {
            AsyncStorage.clear();
            navigation.replace('Login');
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  function formatCurrency(amount) {
    amount = amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  const handleService = ({
    navigation,
    category,
    navigation_screen,
    user_balance,
  }) => {
    navigation.navigate(navigation_screen, {
      user_balance,
      category,
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    getUser();
    setLoading(false);
  };

  // convert to integer
  const user_balance = parseInt(user.balance);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }>
        <Layout style={styles.layout}>
          <View style={styles.header}>
            <View style={[styles.row, styles.headerTitle]}>
              <View style={styles.col}>
                <Text style={styles.title}>Hi, {user.name} </Text>
              </View>
              <View style={[styles.col, styles.deposit]}>
                <Text style={styles.topIcons}>
                  <MaterialCommunityIcons
                    name="help-circle-outline"
                    size={18}
                  />
                  {'  '}
                  <MaterialCommunityIcons name="bell-outline" size={18} />
                </Text>
              </View>
            </View>
            <View style={[styles.row, styles.headerBalance]}>
              <View style={styles.col}>
                <Text category="h6" style={styles.balance}>
                  KMP {formatCurrency(parseInt(user.balance))},00
                </Text>
              </View>
              <View style={[styles.col, styles.deposit]}>
                <TouchableOpacity style={styles.depositBtn}>
                  <View style={styles.row}>
                    <MaterialCommunityIcons
                      name="cash"
                      size={16}
                      color={theme['color-secondary-800']}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        if (user.status != 'active')
                          Alert.alert('Your account is not active!');
                        else navigation.navigate('ExchangeSelectSeller');
                      }}>
                      <Text style={styles.depositTitle}> Exchange</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Card style={styles.card}>
              <View style={[styles.row, styles.serviceList]}>
                <TouchableOpacity
                  style={styles.service}
                  onPress={() =>
                    handleService({
                      navigation,
                      category: 'Transfer',
                      navigation_screen: 'ServiceTransferInputNumber',
                      user_balance,
                    })
                  }>
                  <View style={[styles.col]}>
                    <View style={[styles.serviceIcon, styles.serviceItem]}>
                      <MaterialCommunityIcons
                        name="transfer"
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text style={styles.serviceText}>Transfer</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.service}
                  onPress={() =>
                    handleService({
                      navigation,
                      category: 'Pulsa',
                      navigation_screen: 'ServicePulsaInputNumber',
                      user_balance,
                    })
                  }>
                  <View style={[styles.col]}>
                    <View style={[styles.serviceIcon, styles.serviceItem]}>
                      <MaterialCommunityIcons
                        name="cellphone-wireless"
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text style={styles.serviceText}>Pulsa</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.service}
                  onPress={() =>
                    handleService({
                      navigation,
                      category: 'pln',
                      navigation_screen: 'ServicePlnInputMeterNumber',
                      user_balance,
                    })
                  }>
                  <View style={[styles.col]}>
                    <View style={[styles.serviceIcon, styles.serviceItem]}>
                      <MaterialCommunityIcons
                        name="lightning-bolt"
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text style={styles.serviceText}>PLN</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.service}
                  onPress={() =>
                    handleService({
                      navigation,
                      category: 'Data',
                      navigation_screen: 'ServicePulsaInputNumber',
                      user_balance,
                    })
                  }>
                  <View style={[styles.col]}>
                    <View style={[styles.serviceIcon, styles.serviceItem]}>
                      <MaterialCommunityIcons
                        name="cellphone-arrow-down"
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text style={styles.serviceText}>Data</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
          {/* End Header */}
          <View style={styles.content}>
            {/* Search services */}

            <TextInput
              style={styles.searchInput}
              placeholder="Cari Layanan"
              placeholderTextColor={theme['color-primary-500']}
              onChangeText={() =>
                Alert.alert(
                  'Coming Soon',
                  // 'Fitur ini sedang dalam tahap pengembangan',
                  'Belum ada fitur lain',
                )
              }
            />

            <View style={[styles.row, styles.serviceListAll]}>
              <TouchableOpacity
                style={styles.service}
                onPress={() =>
                  handleService({
                    navigation,
                    category: 'e_wallet',
                    navigation_screen: 'ServiceEwaletFintechList',
                    user_balance,
                  })
                }>
                <View style={[styles.col]}>
                  <View style={[styles.serviceIcon, styles.serviceItemAll]}>
                    <MaterialCommunityIcons
                      name="wallet"
                      size={24}
                      color={theme['color-secondary-800']}
                    />
                  </View>
                  <Text style={styles.serviceTextAll}>E-Wallet</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.service}
                onPress={() =>
                  handleService({
                    navigation,
                    category: 'Bank',
                    navigation_screen: 'ServiceBankList',
                    user_balance,
                  })
                }>
                <View style={[styles.col]}>
                  <View style={[styles.serviceIcon, styles.serviceItemAll]}>
                    <MaterialCommunityIcons
                      name="bank"
                      size={24}
                      color={theme['color-secondary-800']}
                    />
                  </View>
                  <Text style={styles.serviceTextAll}>Bank</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.service}
                onPress={() =>
                  handleService({
                    navigation,
                    category: 'Paket SMS & Telpon',
                    navigation_screen: 'ServicePulsaInputNumber',
                    user_balance,
                  })
                }>
                <View style={[styles.col]}>
                  <View style={[styles.serviceIcon, styles.serviceItemAll]}>
                    <MaterialCommunityIcons
                      name="cellphone"
                      size={24}
                      color={theme['color-secondary-800']}
                    />
                  </View>
                  <Text style={styles.serviceTextAll}>Telp/SMS</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.service}
                onPress={() =>
                  handleService({
                    navigation,
                    category: 'Games',
                    navigation_screen: 'ServiceGames',
                    user_balance,
                  })
                }>
                <View style={[styles.col]}>
                  <View style={[styles.serviceIcon, styles.serviceItemAll]}>
                    <MaterialCommunityIcons
                      name="gamepad"
                      size={24}
                      color={theme['color-secondary-800']}
                    />
                  </View>
                  <Text style={styles.serviceTextAll}>Games</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.row, styles.serviceListAll]}>
              <TouchableOpacity
                style={styles.service}
                onPress={() =>
                  Alert.alert(
                    'Coming Soon',
                    'Fitur ini sedang dalam tahap pengembangan',
                  )
                }>
                <View style={[styles.col]}>
                  <View style={[styles.serviceIcon, styles.serviceItemAll]}>
                    <MaterialCommunityIcons
                      name="hospital"
                      size={24}
                      color={theme['color-secondary-800']}
                    />
                  </View>
                  <Text style={styles.serviceTextAll}>BPJS</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.service}
                onPress={() =>
                  handleService({
                    navigation,
                    category: 'Internet',
                    navigation_screen: 'ServiceInternet',
                    user_balance,
                  })
                }>
                <View style={[styles.col]}>
                  <View style={[styles.serviceIcon, styles.serviceItemAll]}>
                    <MaterialCommunityIcons
                      name="server-network"
                      size={24}
                      color={theme['color-secondary-800']}
                    />
                  </View>
                  <Text style={styles.serviceTextAll}>Internet</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.service}
                onPress={() =>
                  Alert.alert(
                    'Coming Soon',
                    'Fitur ini sedang dalam tahap pengembangan',
                  )
                }>
                <View style={[styles.col]}>
                  <View style={[styles.serviceIcon, styles.serviceItemAll]}>
                    <MaterialCommunityIcons
                      name="television-classic"
                      size={24}
                      color={theme['color-secondary-800']}
                    />
                  </View>
                  <Text style={styles.serviceTextAll}>TV Kabel</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.service}
                onPress={() =>
                  Alert.alert('Coming Soon', 'Belum ada fitur lainnya')
                }>
                <View style={[styles.col]}>
                  <View style={[styles.serviceIcon, styles.serviceItemAll]}>
                    <MaterialCommunityIcons
                      name="format-list-bulleted"
                      size={24}
                      color={theme['color-secondary-800']}
                    />
                  </View>
                  <Text style={styles.serviceTextAll}>Lainnya</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Carousel */}
          <View style={styles.row}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.carouselContainer}>
                <Image
                  style={[styles.carousel, styles.carousel1]}
                  source={require('../../assets/images/carousels/carousel1.png')}
                />
              </View>
              <View style={styles.carouselContainer}>
                <Image
                  style={[styles.carousel, styles.carousel2]}
                  source={require('../../assets/images/carousels/carousel2.png')}
                />
              </View>
              <View style={styles.carouselContainer}>
                <Image
                  style={[styles.carousel, styles.carousel3]}
                  source={require('../../assets/images/carousels/carousel3.png')}
                />
              </View>
            </ScrollView>
          </View>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // spinkitLoader: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: theme['color-dark-500'],
  //   opacity: 0.7,
  //   position: 'absolute',
  //   zIndex: 1000,
  //   width: '100%',
  //   height: '100%',
  // },
  container: {
    flex: 1,
    backgroundColor: theme['color-dark-gray-200'],
  },
  layout: {
    backgroundColor: theme['color-dark-gray-200'],
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 10, // Add your styles here
  },
  card: {
    marginVertical: 20,
    backgroundColor: theme['color-dark-gray-600'],
    borderColor: theme['color-primary-700'],
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
    borderRadius: 10,
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowColor: theme['color-dark-100'],
    shadowRadius: 20,
    elevation: 3,

    shadowRadius: 20,
  },

  header: {
    padding: 15,
    paddingHorizontal: 25,
    backgroundColor: theme['color-dark-500'],
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  headerTitle: {
    justifyContent: 'space-between',
  },

  topIcons: {
    color: theme['color-secondary-500'],
  },

  headerBalance: {
    marginTop: -10,
    justifyContent: 'space-between',
  },

  title: {
    color: theme['color-primary-100'],
  },
  balance: {
    color: theme['color-primary-100'],
    backgroundColor: theme['color-dark-gray-600'],
    paddingHorizontal: 10,
  },

  deposit: {
    alignContent: 'end',
  },
  depositBtn: {
    backgroundColor: theme['color-secondary-500'],
    // marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  depositTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme['color-secondary-800'],
    textAlign: 'right',
  },

  serviceList: {
    marginLeft: -24,
    justifyContent: 'space-between',
  },
  service: {
    padding: 5,
  },
  serviceItem: {
    borderColor: 'black', // Add your styles here
    backgroundColor: theme['color-primary-600'],
    color: theme['color-primary-100'],
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme['color-primary-500'],
    width: 54,
    height: 54,

    borderRightColor: theme['color-dark-gray-800'],
    borderBottomColor: theme['color-dark-gray-800'],
  },

  serviceIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 54,
    height: 54,
  },
  serviceText: {
    color: theme['color-primary-100'],
    marginTop: 5,
    fontWeight: 'light',
    textAlign: 'center',
    fontSize: 12,
  },
  serviceTextAll: {
    color: theme['color-primary-600'],
    marginTop: 5,
    fontWeight: 'light',
    textAlign: 'center',
    fontSize: 12,
  },

  searchInput: {
    height: 48,
    borderColor: theme['color-primary-100'],
    backgroundColor: theme['color-dark-gray-100'],
    borderWidth: 1,
    borderRadius: 50,
    marginHorizontal: 25,
    paddingHorizontal: 25,
    marginTop: 30,
    marginBottom: 15,
    margin: 10,
    color: theme['color-dark-500'],
  },

  serviceListAll: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  serviceItemAll: {
    borderColor: 'black', // Add your styles here
    backgroundColor: theme['color-secondary-300'],
    color: theme['color-dark-500'],
    borderRadius: 15,
    width: 54,
    height: 54,
  },

  carouselContainer: {
    // alignItems: 'center',
    // justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 25,
    marginBottom: 25,
    // width: '100%',
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  carousel: {
    height: '100%',
    width: 230,
    position: 'relative',
    borderRadius: 15,
  },
  carousel1: {
    marginLeft: 15,
  },
  carousel3: {
    marginRight: 15,
  },
});

export default HomeScreen;
