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
    const res = await ApiManager.get('transaction/price-list', {
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
  userBearerToken,
  userKey,
  dest_number,
  product_sku_code,
  product_category,
  product_brand,
  product_type,
  amount,
  connection,
  description,
  ref_id,
  signature,
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
      ref_id: ref_id,
      signature: signature,
    };

    console.log(bodyParameters);

    // return;

    const res = await ApiManager.post('transaction', bodyParameters, config);
    return res;
  } catch (error) {
    console.error(error);
  }
};
const postpaid_inquiry = async (
  userBearerToken,
  userKey,
  dest_number,
  product_sku_code,
  amount,
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
      amount: amount,
    };

    console.log(bodyParameters);

    // return;

    const res = await ApiManager.post(
      'transaction-inquiry',
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
    const res = await ApiManager.get('transaction/' + id, {
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
      'check-account-name',
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
  postpaid_inquiry,
  transaction_show,
  account_ref,
};
