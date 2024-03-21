import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';

import {default as theme} from '../../../theme.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {bid_list, billings} from '../../api/exchange_api';
import 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Card, Text} from '@ui-kitten/components';

const BidQueue = ({navigation, route}) => {
  const {account_number, ask_quantity, ask_price} = route.params;

  const [bids, setBids] = useState([['-', '-', '-']]);
  const [partnerBillings, setPartnerBillings] = useState([['-', '-', '-']]);

  useEffect(() => {
    getBidList();
    getPartnerBillings();
  }, []);

  const [tableHead, setTableHead] = useState([
    'Tanggal',
    'ID Transaksi',
    'Status',
  ]);

  const getBidList = async () => {
    const userKey = await AsyncStorage.getItem('user-key');
    const userBearerToken = await AsyncStorage.getItem('bearer-token');

    try {
      await bid_list(account_number, userKey, userBearerToken).then(res => {
        if (res.status === 200) {
          const bid_list = res.data.data;

          setBids(
            bid_list.map(item => [item.date, item.order_id, item.status]),
          );
          console.log(bid_list);
          // setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const snapPoints = useMemo(() => ['25%', '80%'], []);
  // ref
  const bottomSheetRef = useRef();

  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const getPartnerBillings = async () => {
    const userKey = await AsyncStorage.getItem('user-key');
    const userBearerToken = await AsyncStorage.getItem('bearer-token');

    try {
      await billings(account_number, userKey, userBearerToken).then(res => {
        if (res.status === 200) {
          const billings = res.data.data;

          setPartnerBillings(billings);
          console.log(billings);
          // setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // <GestureHandlerRootView>
    <View style={styles.container}>
      <Table
        style={styles.table}
        borderStyle={{
          borderWidth: 2,
          borderColor: theme['color-secondary-600'],
        }}>
        <Row data={tableHead} style={styles.head} />
        <Rows data={bids} textStyle={styles.text} />
      </Table>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <Text>Pilih Metode Pembayaran</Text>
          <FlatList
            data={partnerBillings}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <Billing
                  key={item.id}
                  billingItem={item}
                  onPress={() =>
                    goToInputNominal({
                      navigation,
                      account_number,
                      ask_quantity,
                      ask_price,
                      item,
                    })
                  }
                />
              );
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
    // </GestureHandlerRootView>
  );
};

const goToInputNominal = ({
  navigation,
  account_number,
  ask_quantity,
  ask_price,
  item,
}) => {
  console.log(item.provider_name);
  // Alert.alert('Coming Soon', 'Fitur ini dibatasi');

  navigation.navigate('ExchangeInputDepositNominal', {
    partner_kampua_number: account_number,
    ask_quantity: ask_quantity,
    ask_price: ask_price,
    payment_method: item.payment_method,
    provider_name: item.provider_name,
    partner_billing_name: item.name,
    partner_billing_number: item.number,
  });
};

const Billing = ({billingItem, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{marginTop: 15, marginHorizontal: 15}}>
      <Card style={{backgroundColor: '#F1F5F7'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={{color: '#2e3d49', fontWeight: 'bold'}}>
              BANK {billingItem.provider_name}
            </Text>
          </View>
          <Text
            style={{
              color:
                billingItem.status == 'incative'
                  ? 'red'
                  : billingItem.status == 'active'
                  ? 'green'
                  : '#2e3d49',
              fontWeight: 'bold',
              marginLeft: 10,
              alignContent: 'flex-end',
            }}>
            {billingItem.status}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    // backgroundColor: 'grey',
    backgroundColor: theme['color-primary-500'],
  },
  table: {backgroundColor: theme['color-primary-100']},
  head: {height: 40, backgroundColor: theme['color-secondary-500']},
  text: {margin: 6, color: theme['color-dark-500']},
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default BidQueue;
