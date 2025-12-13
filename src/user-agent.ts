import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

export function buildUserAgent(): string {
  const isIOS = Platform.OS === 'ios';
  const osVersion = Device.osVersion || '0.0';
  const model = Device.modelName || 'Device';
  const appVersion = Application.nativeApplicationVersion || '0.0.0';

  if (isIOS) {
    return `Mozilla/5.0 (${model}; CPU iPhone OS ${osVersion.replace(
      /\./g,
      '_'
    )} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${appVersion} Mobile/15E148 Safari/605.1.15`;
  } else {
    const appName = Constants.expoConfig?.name || Application.applicationName || 'ExpoApp';
    const expoVersion = Constants.expoVersion || 'unknown';
    // Use app-specific format for Android to fix Chrome detection
    return `${appName}/${appVersion} (Linux; Android ${osVersion}; ${model}) Expo/${expoVersion}`;
  }
}
