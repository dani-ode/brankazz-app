import ApiManager from './ApiManager';

const transaction_price_list = async (
  category,
  brand,
  buyerSkuCodeType,
  userKey,
  userBearerToken,
) => {
  try {
    const res = await ApiManager.get(
      'https://brankazz.corpo.id/api/transaction/price-list',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Key': '3c956f3ef687c89695873c277f1098c1',
          'User-Key': userKey,
          Authorization: 'Bearer ' + userBearerToken,
        },
        params: {
          product_category: category,
          product_brand: brand,
          product_sku_code_type: buyerSkuCodeType,
        },
      },
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

const transaction_create = async (
  product_sku_code,
  dest_number,
  category,
  product_type,
  for_type,
  userKey,
  userBearerToken,
) => {
  try {
    const config = {
      headers: {
        'Access-Key': '3c956f3ef687c89695873c277f1098c1',
        'User-Key': userKey,
        Authorization: `Bearer ${userBearerToken}`,
      },
    };

    const bodyParameters = {
      dest_number: dest_number,
      product_sku_code: product_sku_code,
      product_category: category,
      product_brand: product_type,
      product_type: for_type,
    };

    // console.log(bodyParameters);

    const res = await ApiManager.post(
      'https://brankazz.corpo.id/api/transaction',
      bodyParameters,
      config,
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

export {transaction_price_list, transaction_create};
