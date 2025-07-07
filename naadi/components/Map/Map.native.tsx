import React, { ReactNode, ForwardedRef } from 'react';
import { Marker, Polyline, PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';
import Clustering from 'react-native-map-clustering';

export interface CustomMapViewProps extends MapViewProps {
  children?: ReactNode;
  renderCluster?: (cluster: any) => ReactNode;
  radius?: number;
}

const CustomMapView: React.FC<CustomMapViewProps & { ref?: ForwardedRef<any> }> = React.forwardRef<any, CustomMapViewProps>(
  (props, ref: ForwardedRef<any>) => {
    return (
      <Clustering
        {...props}
        provider={PROVIDER_GOOGLE}
        mapRef={(map: any) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(map);
            } else {
              (ref as React.MutableRefObject<any>).current = map;
            }
          }
        }}
      >
        {props.children}
      </Clustering>
    );
  }
);

export default CustomMapView;
export { Marker, Polyline };
