import {
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card, Text} from '@ui-kitten/components';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {default as theme} from '../../../../theme.json';
import Images from '../../../assets/images';

const BankList = ({route, navigation}) => {
  const {user_balance, category} = route.params;

  console.log(user_balance, category);

  const [bank, setBank] = useState([]);

  useEffect(() => {
    getBank();
  }, []);

  const [isLoading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const selectBank = item => {
    Alert.alert(item.brand, 'Fitur ini dibatasi');

    const brand = item.brand;
    const code = item.code;

    // navigation.navigate('ServiceBankInputAccountNumber', {
    //   user_balance,
    //   category,
    //   brand,
    //   code,
    // });
  };

  const getBank = async () => {
    setBank([
      {
        brand: 'Bank BCA',
        code: 'bca',
        logo: Images.BankLogo.bcaLogo,
      },
      {
        brand: 'Bank BNI',
        code: 'bni',
        logo: Images.BankLogo.bniLogo,
      },
      {
        brand: 'Bank BRI',
        code: 'bri',
        logo: Images.BankLogo.briLogo,
      },
      {
        brand: 'Bank BTPN',
        code: 'btpn',
        logo: Images.BankLogo.btpnLogo,
      },
      {
        brand: 'Bank Mandiri',
        code: 'mandiri',
        logo: Images.BankLogo.mandiriLogo,
      },
      {
        brand: 'Bank Permata',
        code: 'permata',
        logo: Images.BankLogo.permataLogo,
      },
    ]);
    setLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getBank();
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
        data={bank}
        renderItem={({item}) => {
          return (
            <BankItem
              key={item.code}
              bank={item}
              onPress={() => selectBank(item)}
            />
          );
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const BankItem = ({bank, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{marginTop: 15, marginHorizontal: 15}}>
      <Card style={{backgroundColor: '#F1F5F7'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'column'}}>
            <Image
              source={bank.logo}
              style={{width: 50, height: 30, resizeMode: 'contain'}}
            />
          </View>
          <Text
            style={{
              color: '#2e3d49',
              marginLeft: 10,
              alignContent: 'flex-end',
              alignSelf: 'flex-end',
            }}>
            {bank.brand}
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

export default BankList;
