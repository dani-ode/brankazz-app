import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card} from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';

// import {Table, Row, Rows} from 'react-native-table-component';
import {deposit_lists} from '../../../api/mutasi_api';

const Deposit = ({navigation}) => {
  let date = new Date().getDate();
  let currentDate = new Date().getDate() + 2;
  let month = new Date().getMonth();
  let currentMonth = new Date().getMonth() + 1;
  let year = new Date().getFullYear();

  const [mutasi, setMutasi] = useState([]);
  const [firstDate, setfirstDate] = useState(year + '-' + month + '-' + date);
  const [endDate, setEndDate] = useState(
    year + '-' + currentMonth + '-' + currentDate,
  );

  useEffect(() => {
    getMutasi();
  }, []);

  const getMutasi = async () => {
    try {
      const userKey = await AsyncStorage.getItem('user-key');

      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(firstDate, endDate, userKey, userBearerToken);

      await deposit_lists(firstDate, endDate, userKey, userBearerToken).then(
        res => {
          // console.log(res);
          if (res.status === 200) {
            console.log(res.data.data);
            setMutasi(res.data.data);
            // setLoading(false);

            setLoading(false);
          }
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  function formatCurrency(amount) {
    amount = amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  const [isLoading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const goToDetail = item => {
    navigation.navigate('DepositDetail', {id: item.id});
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getMutasi();
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
      {/* <ScrollView> */}
      <FlatList
        style={{marginBottom: 10}}
        data={mutasi}
        renderItem={({item}) => {
          return (
            <MutasiItem
              key={item.id}
              mutasi={item}
              onPress={() => goToDetail(item)}
            />
          );
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const MutasiItem = ({mutasi, onPress}) => {
  function formatCurrency(amount) {
    amount = amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{marginTop: 15, marginHorizontal: 15}}>
      <Card style={{backgroundColor: '#F1F5F7'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={{color: '#2e3d49', fontWeight: 'bold'}}>
              {mutasi.amount}
            </Text>
            <Text style={{fontWeight: 'light', color: '#57636d', fontSize: 11}}>
              Tanggal : {mutasi.date}
            </Text>
          </View>
          <Text
            style={{
              color:
                mutasi.status == 'Gagal'
                  ? 'red'
                  : mutasi.status == 'Sukses' || mutasi.status == 'settlement'
                  ? 'green'
                  : '#2e3d49',
              fontWeight: 'bold',
              marginLeft: 10,
              alignContent: 'flex-end',
            }}>
            {mutasi.status}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingHorizontal: 25,
    backgroundColor: theme['color-dark-gray-200'],
  },
  line: {
    borderBottomColor: theme['color-dark-gray-300'],
    borderBottomWidth: 1,
    marginVertical: 10, // Adjust this value to change the vertical space around the line
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  card: {
    marginTop: 15,
    backgroundColor: theme['color-primary-200'],
    // borderRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  text: {
    color: theme['color-dark-gray-500'],
    // fontSize: 15,
  },
  textValue: {
    textAlign: 'right',
    color: theme['color-dark-500'],
    fontSize: 15,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 30,
    margin: 10,
  },
  button: {
    height: 48,
    backgroundColor: theme['color-secondary-500'],
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 25,
    borderColor: theme['color-secondary-600'],
    borderWidth: 1,
  },
  totalText: {
    color: theme['color-secondary-900'],
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 15,
  },
  buttonText: {
    color: theme['color-secondary-900'],
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 15,
  },
});
export default Deposit;
