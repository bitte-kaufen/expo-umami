import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';

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
    return `Mozilla/5.0 (Linux; Android ${osVersion}; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${appVersion} Mobile Safari/537.36`;
  }
}
