import {
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {transaction_price_list} from '../../../api/transaction_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Text} from '@ui-kitten/components';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {default as theme} from '../../../../theme.json';
import Images from '../../../assets/images';

const FintechList = ({route, navigation}) => {
  const {user_balance, category} = route.params;

  console.log(user_balance, category);

  const [fintech, setFintech] = useState([]);

  useEffect(() => {
    getFintech();
    console.log('Gopay Image ' + Images.FintechLogo.gopaycLogo);
  }, []);

  const [isLoading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const selectFintech = item => {
    const brand = item.brand;
    const code = item.code;
    const relativeCode = item.relativeCode;
    const checkUserCode = item.checkUserCode;

    navigation.navigate('ServiceEwaletInputNumber', {
      user_balance,
      category,
      brand,
      code,
      relativeCode,
      checkUserCode,
    });
  };

  const getFintech = async () => {
    setFintech([
      {
        brand: 'Gopay Customer',
        code: 'gopayc_',
        relativeCode: 'gopay_relative',
        checkUserCode: 'gopay_check_user',
        logo: Images.FintechLogo.gopaycLogo,
      },
      {
        brand: 'Gopay Driver',
        code: 'gopayd_',
        relativeCode: 'gopay_relative',
        checkUserCode: 'gopay_check_user',
        logo: Images.FintechLogo.gopaydLogo,
      },
      {
        brand: 'LinkAja',
        code: 'linkaja_',
        relativeCode: '',
        checkUserCode: 'linkaja_check_user',
        logo: Images.FintechLogo.linkajaLogo,
      },
      {
        brand: 'OVO',
        code: 'ovo_',
        relativeCode: 'ovo_relative',
        checkUserCode: 'ovo_check_user',
        logo: Images.FintechLogo.ovoLogo,
      },
      {
        brand: 'Shopee Pay',
        code: 'shppay_',
        relativeCode: 'shppay_relative',
        checkUserCode: 'shppay_check_user',
        logo: Images.FintechLogo.shppayLogo,
      },
      {
        brand: 'Mitra Shopee',
        code: 'shppaym_',
        relativeCode: 'shppay_relative',
        checkUserCode: 'shppay_check_user',
        logo: Images.FintechLogo.shppaymLogo,
      },
      {
        brand: 'Dana',
        code: 'dana_',
        relativeCode: 'dana_relative',
        checkUserCode: 'dana_check_user',
        logo: Images.FintechLogo.danaLogo,
      },
      {
        brand: 'i.Saku',
        code: 'isaku_',
        relativeCode: '',
        checkUserCode: 'isaku_check_user',
        logo: Images.FintechLogo.isakuLogo,
      },
      {
        brand: 'Maxim Customer',
        code: 'maximc_',
        relativeCode: '',
        checkUserCode: '',
        logo: Images.FintechLogo.maximcLogo,
      },
      {
        brand: 'Maxim Driver',
        code: 'maximd_',
        relativeCode: '',
        checkUserCode: '',
        logo: Images.FintechLogo.maximdLogo,
      },
      {
        brand: 'Grab Umum',
        code: 'grabu_',
        relativeCode: '',
        checkUserCode: '',
        logo: Images.FintechLogo.grabuLogo,
      },
      {
        brand: 'Grab Driver',
        code: 'grabc_',
        relativeCode: '',
        checkUserCode: '',
        logo: Images.FintechLogo.grabcLogo,
      },
      {
        brand: 'Sakuku',
        code: 'sakuku_',
        relativeCode: '',
        checkUserCode: '',
        logo: Images.FintechLogo.sakukuLogo,
      },
      {
        brand: 'Doku',
        code: 'doku_',
        relativeCode: '',
        checkUserCode: '',
        logo: Images.FintechLogo.dokuLogo,
      },
    ]);
    setLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getFintech();
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
        data={fintech}
        renderItem={({item}) => {
          return (
            <FintechItem
              key={item.code}
              fintech={item}
              onPress={() => selectFintech(item)}
            />
          );
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const FintechItem = ({fintech, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{marginTop: 15, marginHorizontal: 15}}>
      <Card style={{backgroundColor: '#F1F5F7'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'column'}}>
            <Image
              source={fintech.logo}
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
            {fintech.brand}
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

export default FintechList;
