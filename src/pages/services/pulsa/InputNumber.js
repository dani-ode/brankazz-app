import {
  Layout,
  Text,
  Button,
  IconRegistry,
  Icon,
  Card,
  Datepicker,
  Input,
} from '@ui-kitten/components';

import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {getOperator} from '../../../utils/getOperator';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';

const InputNumber = ({route}) => {
  const {user_balance, category} = route.params;
  const navigation = useNavigation();
  const [number, setNumber] = useState(0);

  const type = 'prabayar';

  let brandCard = '';

  if (number.length > 6) {
    const brand = getOperator(number);
    if (brand.message == 'VALID') {
      // console.log(brand);
      // return;
      brandCard = brand.card;
      // set show button
    }
  }

  const handleProduct = async (by_type, number) => {
    if (number == 0) {
      alert('Masukkan nomor yang valid');
      return;
    }
    const brand = getOperator(number);

    if (!brand) {
      alert('Masukkan nomor yang valid');
      return;
    }
    if (brand.message === 'INVALID') {
      alert('Masukkan nomor yang valid');
      return;
    }

    const brand_name = brand.operator.toUpperCase();

    navigation.navigate('PriceList', {
      number: number,
      category: category,
      brand: brand_name,
      product_sku_code_type: by_type,
      type: type,
      user_balance: user_balance,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Layout style={styles.layout}>
          <Card style={styles.card}>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="Masukkan Nomor HP"
              autoFocus={true}
              placeholderTextColor={theme['color-primary-600']}
              onChangeText={number => setNumber(number)}
            />
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme['color-dark-500'],
                },
              ]}
              onPress={() => {
                handleProduct('tsel_p', number);
              }}>
              <Text
                style={[
                  styles.buttonText,
                  {color: theme['color-secondary-400']},
                ]}>
                {category} Promo {brandCard}{' '}
                <MaterialCommunityIcons name="arrow-right" size={16} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme['color-dark-500'],
                },
              ]}
              onPress={() => {
                handleProduct('tsel_r', number);
              }}>
              <Text
                style={[
                  styles.buttonText,
                  {color: theme['color-primary-400']},
                ]}>
                {category} Reguler {brandCard}{' '}
                <MaterialCommunityIcons name="arrow-right" size={16} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme['color-dark-500'],
                },
              ]}
              onPress={() => {
                handleProduct('tselt_r', number);
              }}>
              <Text
                style={[
                  styles.buttonText,
                  {color: theme['color-dark-gray-300']},
                ]}>
                {category} Transfer {brandCard}{' '}
                <MaterialCommunityIcons name="arrow-right" size={16} />
              </Text>
            </TouchableOpacity>
          </Card>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: theme['color-dark-gray-200'],
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // Add your styles here
    borderColor: 'black', // Add your styles here
    padding: 10, // Add your styles here
  },
  layout: {
    backgroundColor: theme['color-dark-gray-200'],
  },

  card: {
    borderRadius: 15,
    marginVertical: 15,
    paddingVertical: 15,
    backgroundColor: theme['color-dark-500'],
  },

  input: {
    height: 40,
    borderBottomColor: 'white',
    borderTopColor: theme['color-dark-gray-600'],
    borderLeftColor: theme['color-dark-gray-600'],
    borderRightColor: theme['color-dark-gray-600'],
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 30,
    margin: 10,
    backgroundColor: theme['color-dark-gray-600'],
    color: theme['color-primary-100'],
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    height: 60,
  },

  button: {
    // paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    margin: 10,
  },
  buttonText: {
    textAlign: 'right',
  },
});

export default InputNumber;
