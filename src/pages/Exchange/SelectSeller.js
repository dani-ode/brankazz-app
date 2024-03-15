import {ask_list} from '../../api/exchange_api';
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Layout, Text} from '@ui-kitten/components';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {default as theme} from '../../../theme.json';

const SelectSeller = ({navigation}) => {
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    getAskList();
  }, []);

  const [isLoading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const selectAsk = item => {
    console.log(item);
    const account_number = item.user_account;
    const ask_quantity = item.quantity;
    const ask_price = item.price;
    const user_name = item.user_name;
    navigation.navigate('ExchangeBidQueue', {
      account_number,
      ask_quantity,
      ask_price,
      user_name,
    });
  };

  const getAskList = async () => {
    const userKey = await AsyncStorage.getItem('user-key');
    const userBearerToken = await AsyncStorage.getItem('bearer-token');

    try {
      await ask_list(userKey, userBearerToken).then(res => {
        if (res.status === 200) {
          const ask_list = res.data.data;
          setAsks(ask_list);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getAskList();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator
        color={theme['color-secondary-500']}
        animating={isLoading}
        style={{marginTop: 50, display: isLoading ? 'flex' : 'none'}}
        size={'large'}
      />
      <FlatList
        style={{marginBottom: 10}}
        data={asks}
        renderItem={({item}) => {
          return (
            <AskItem
              key={item.user_account}
              ask={item}
              onPress={() => selectAsk(item)}
            />
          );
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const AskItem = ({ask, onPress}) => {
  function formatCurrency(amount) {
    amount = Number(amount)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{marginTop: 15, marginHorizontal: 15}}>
      <Card style={{backgroundColor: '#F1F5F7'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={{color: '#2e3d49'}}>
              {ask.user_account} - ({ask.user_name})
            </Text>
            <Text style={{fontWeight: 'light', color: '#57636d', fontSize: 11}}>
              Ask - (qty:{formatCurrency(ask.quantity)}), (price : {ask.price}
              /Rp)
            </Text>
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#2e3d49',
              marginLeft: 10,
              alignContent: 'flex-end',
              alignSelf: 'flex-end',
            }}>
            {/* Rp {formatCurrency(ask.user_name)} */}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme['color-dark-gray-200'],
    paddingHorizontal: 10,
  },
});

export default SelectSeller;
