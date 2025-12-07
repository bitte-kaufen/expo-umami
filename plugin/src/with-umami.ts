import { ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';

export interface UmamiPluginProps {
  websiteId: string;
  hostUrl: string;
  batchSize?: number;
  batchInterval?: number;
  persistEvents?: boolean;
  debug?: boolean;
}

const withUmami: ConfigPlugin<UmamiPluginProps> = (config, props) => {
  if (!props) {
    throw new Error(
      '[@bitte-kaufen/expo-umami] Plugin requires configuration. Please provide websiteId and hostUrl.'
    );
  }

  if (!props.websiteId || !props.hostUrl) {
    throw new Error(
      '[@bitte-kaufen/expo-umami] Both websiteId and hostUrl are required.'
    );
  }

  if (!config.extra) {
    config.extra = {};
  }

  config.extra.umami = {
    websiteId: props.websiteId,
    hostUrl: props.hostUrl,
    batchSize: props.batchSize || 10,
    batchInterval: props.batchInterval || 30000,
    persistEvents: props.persistEvents ?? false,
    debug: props.debug ?? false,
  };

  return config;
};

const pkg = {
  name: '@bitte-kaufen/expo-umami',
  version: '0.1.0',
};

export default createRunOncePlugin(withUmami, pkg.name, pkg.version);
