import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';

const deposit_create = async (
  userBearerToken,
  userKey,
  method,
  provider,
  amount,
  partner,
  third_party,
  description,
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
      method: method,
      provider: provider,
      amount: amount,
      partner: partner,
      third_party: third_party,
      description: description,
    };

    console.log(bodyParameters);

    const res = await ApiManager.post('/api/deposit', bodyParameters, config);
    return res;
  } catch (error) {
    console.error(error);
  }
};
const deposit_show = async (id, userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get('/api/deposit/' + id, {
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
    return error;
  }
};

export {deposit_create, deposit_show};
