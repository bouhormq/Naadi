// components/Map.web.js
import React from 'react';
// Correct import path for react-native-web-maps (assuming it's a direct import for MapView)
import MapView, { Marker, Polyline } from '@teovilla/react-native-web-maps';

const WebMapView = React.forwardRef((props, ref) => (
  <MapView
    provider="google"
    ref={ref}
    googleMapsApiKey={process.env.EXPO_PUBLIC_Maps_API_KEY_WEB}
    {...props}
  />
));

export default WebMapView;
export { Marker, Polyline };