import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';

const transaction_price_list = async (
  category,
  brand,
  buyerSkuCodeType,
  userKey,
  userBearerToken,
) => {
  try {
    const res = await ApiManager.get('/api/transaction/price-list', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: 'Bearer ' + userBearerToken,
      },
      params: {
        product_category: category,
        product_brand: brand,
        product_sku_code_type: buyerSkuCodeType,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

const transaction_create = async (
  dest_number,
  product_sku_code,
  product_category,
  product_brand,
  product_type,
  amount,
  connection,
  description,
  userKey,
  userBearerToken,
) => {
  try {
    const config = {
      headers: {
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: `Bearer ${userBearerToken}`,
      },
    };

    const bodyParameters = {
      dest_number: dest_number,
      product_sku_code: product_sku_code,
      product_category: product_category,
      product_brand: product_brand,
      product_type: product_type,
      amount: amount,
      connection: connection,
      description: description,
    };

    console.log(bodyParameters);

    const res = await ApiManager.post(
      '/api/transaction',
      bodyParameters,
      config,
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};
const transaction_show = async (id, userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get('/api/transaction/' + id, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: 'Bearer ' + userBearerToken,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
const account_ref = async (
  userKey,
  userBearerToken,
  number,
  product_sku_code,
  brand,
) => {
  console.log(userKey, userBearerToken, number, product_sku_code, brand);
  try {
    const config = {
      headers: {
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: `Bearer ${userBearerToken}`,
      },
    };

    const bodyParameters = {
      number: number,
      product_sku_code: product_sku_code,
      brand: brand,
    };

    console.log(bodyParameters);

    const res = await ApiManager.post(
      '/api/check-account-name',
      bodyParameters,
      config,
    );
    // console.log(res);
    return res;
  } catch (error) {
    console.error(error);
  }
};
export {
  transaction_price_list,
  transaction_create,
  transaction_show,
  account_ref,
};
