import { Platform } from 'react-native';

const MarkerModule = Platform.select({
  web: () => require('./Markers.web'),
  native: () => require('./Markers.native'),
})();

export default MarkerModule.default;
