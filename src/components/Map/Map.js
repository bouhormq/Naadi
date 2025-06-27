// Import everything from react-native-maps
import { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import React from 'react'; // Don't forget to import React
import Clustering from 'react-native-map-clustering';

// Re-export the components you need, ensuring Google Maps is the provider
const NativeMapView = React.forwardRef((props, ref) => (
  <Clustering
    {...props}
    provider={PROVIDER_GOOGLE}
    mapRef={(map) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(map);
        } else {
          ref.current = map;
        }
      }
    }}
  />
));

export default NativeMapView;
export { Marker, Polyline };