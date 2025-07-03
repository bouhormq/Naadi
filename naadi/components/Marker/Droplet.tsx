import React from 'react';
import { StyleSheet, View } from 'react-native';

type DropletProps = React.PropsWithChildren<{}>;

const Droplet: React.FC<DropletProps> = ({ children }) => (
  <View style={styles.markerContainer}>
    <View style={styles.bubble}>
      <View style={styles.innerChildContainer}>{children}</View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  markerContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: 'white',
    width: 35,
    height: 35,
    transform: [{ rotate: '45deg' }],
    borderRadius: 20,
    borderBottomRightRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  innerChildContainer: {
    transform: [{ rotate: '-45deg' }],
  },
});

export default Droplet;
