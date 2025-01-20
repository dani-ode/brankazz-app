import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';
import {BRANKAZZ_ADMIN_KEY} from '@env';

const MAX_RETRIES = 3;
const user_login = async (email, password) => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log(email, password);
      const res = await ApiManager.get('login', {
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
    const res = await ApiManager.get('user/' + userId, {
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
const user_update_profile = async (
  userId,
  userKey,
  userBearerToken,
  userRole,
  name,
  email,
  profileImg,
) => {
  try {
    const config = {
      headers: {
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: `Bearer ${userBearerToken}`,
        'Content-Type': 'multipart/form-data',
        'Admin-Key': userRole == 'admin' ? BRANKAZZ_ADMIN_KEY : '',
      },
    };

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('profile_img', {
      uri: profileImg,
      type: 'image/jpeg',
      name: userId + '_profile_image.jpg',
    });

    // const bodyParameters = {
    //   name: name,
    //   email: email,
    //   profile_img: profileImage,
    // };

    console.log(userId, userKey, userBearerToken, formData);

    const res = await ApiManager.post('user/' + userId, formData, config);
    // console.log(res);
    return res;
  } catch (error) {
    console.error(error);
  }
};
const user_logout = async (userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get('logout', {
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
const user_fcm_token = async (user_id, fcm_token, userKey, userBearerToken) => {
  try {
    const config = {
      headers: {
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: `Bearer ${userBearerToken}`,
      },
    };

    const bodyParameters = {
      user_id: user_id,
      fcm_token: fcm_token,
    };

    console.log(bodyParameters);

    const res = await ApiManager.post(
      'create-personal-fcm-token',
      bodyParameters,
      config,
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

const user_resend_email_verification = async (userKey, userBearerToken) => {
  try {
    const config = {
      headers: {
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: `Bearer ${userBearerToken}`,
      },
    };

    const bodyParameters = {};

    console.log(bodyParameters);

    const res = await ApiManager.post(
      '/email/verify/resend',
      bodyParameters,
      config,
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

export {
  user_login,
  user_profile,
  user_update_profile,
  user_logout,
  user_fcm_token,
  user_resend_email_verification,
};
