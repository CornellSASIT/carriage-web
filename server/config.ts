import dotenv from 'dotenv';
import path from 'path';

//dotenv.config({ path: path.join(__dirname, '.env') });
// mg223 has done this and it seems to break config.env pathing, amazingly
dotenv.config();

export default {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

export const webpushValues = {
  contact: process.env.WEB_PUSH_CONTACT!,
  public: process.env.PUBLIC_VAPID_KEY!,
  private: process.env.PRIVATE_VAPID_KEY!,
};

export const snsValues = {
  ios_driver: process.env.IOS_DRIVER_ARN!,
  ios_rider: process.env.IOS_RIDER_ARN!,
  android: process.env.ANDROID_ARN!,
};
