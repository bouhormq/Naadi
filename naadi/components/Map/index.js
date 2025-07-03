import { Platform } from 'react-native';

const MapModule = Platform.select({
  web: () => require('./Map.web'),
  native: () => require('./Map.native'),
})();

export default MapModule.default;
export const Marker = MapModule.Marker;
