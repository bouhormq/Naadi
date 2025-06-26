// Import everything from react-native-maps
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import React from 'react'; // Don't forget to import React

// Re-export the components you need, ensuring Google Maps is the provider
const NativeMapView = React.forwardRef((props, ref) => (
  <MapView provider={PROVIDER_GOOGLE} ref={ref} {...props} />
));

export default NativeMapView;
export { Marker, Polyline };