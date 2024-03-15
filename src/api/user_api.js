import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';

const MAX_RETRIES = 3;
const user_login = async (email, password) => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log(email, password);
      const res = await ApiManager.get('/api/login', {
        headers: {
          'Access-Key': BRANKAZZ_ACCESS_KEY,
        },

        timeout: 5000,
        params: {
          email: email,
          password: password,
        },
      });

      console.log(res);

      return res;
    } catch (error) {
      console.error(`Error on attempt ${retries + 1}:`, error);
      retries++;
    }
  }

  console.error(`Login failed after ${MAX_RETRIES} attempts.`);
  return {error: 'Login failed. Please try again later.'};
};

const user_profile = async (userId, userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get('/api/user/' + userId, {
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

export {user_login, user_profile};
