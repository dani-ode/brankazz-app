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
import {transaction_price_list} from '../../../api/transaction_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Layout, Text} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {default as theme} from '../../../../theme.json';
// import {
//   formatCurrency,
//   getSupportedCurrencies,
// } from 'react-native-format-currency';

// const handleProduct = product => {
//   console.log(product);
//   Alert.alert(product.product_name);
// };

const PriceList = ({route, navigation}) => {
  const {
    number,
    category,
    brand,
    product_sku_code_type,
    type,
    user_balance,
    ewalet_check_user_code,
  } = route.params;

  console.log(
    number,
    category,
    brand,
    product_sku_code_type,
    type,
    user_balance,
    ewalet_check_user_code,
  );

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getPriceList();
  }, []);

  const [isLoading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const selectProduct = item => {
    if (!item.buyer_product_status || !item.seller_product_status) {
      Alert.alert('Tidak Aktif!', item.product_name);
      return;
    }

    const product_sku_code = item.product_sku_code;
    const product_price = item.price;
    navigation.navigate('CheckOut', {
      number,
      category,
      brand,
      product_sku_code,
      type,
      product_price,
      user_balance,
      ewalet_check_user_code,
    });
  };

  const getPriceList = async () => {
    const userKey = await AsyncStorage.getItem('user-key');
    const userBearerToken = await AsyncStorage.getItem('bearer-token');

    try {
      await transaction_price_list(
        category,
        brand,
        product_sku_code_type,
        userKey,
        userBearerToken,
      ).then(res => {
        if (res.status === 200) {
          const product_list = res.data.data;
          setProducts(product_list);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getPriceList();
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
        data={products}
        renderItem={({item}) => {
          return (
            <ProductItem
              key={item.product_sku_code}
              product={item}
              isActive={item.buyer_product_status && item.seller_product_status}
              onPress={() => selectProduct(item)}
            />
          );
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const ProductItem = ({product, isActive, onPress}) => {
  function formatCurrency(amount) {
    amount = amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{marginTop: 15, marginHorizontal: 15}}>
      <Card style={{backgroundColor: !isActive ? '#EDF5F7' : '#F1F5F7'}}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            padding: 8,
            backgroundColor: 'rgba(180, 180, 180, 0.7)',

            display: !isActive ? 'flex' : 'none',
          }}>
          <Text style={{fontWeight: 'bold', color: '#57636d'}}>
            Tidak aktif
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'column', maxWidth: '83%'}}>
            <Text
              style={{
                color: !isActive ? '#8E9DA7' : '#2e3d49',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              {product.product_name}
            </Text>
            <Text
              style={{
                fontWeight: 'light',
                color: !isActive ? '#8E9DA7' : '#57636d',
                fontSize: 13,
              }}>
              Layanan {product.end_cut_off} s/d {product.start_cut_off}
            </Text>
          </View>
          <Text
            style={{
              color: !isActive ? '#8E9DA7' : '#2e3d49',
              marginLeft: 10,
              alignContent: 'flex-end',
              alignSelf: 'flex-end',
              backgroundColor: '#fff',
              paddingHorizontal: 5,
              borderRadius: 5,
              position: 'absolute',
              right: -20,
              bottom: -12,
              zIndex: 1,
            }}>
            {formatCurrency(product.price)}
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

export default PriceList;
