import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';

import styles from './loader.style';

const Loader = ({isLoader}) => (
  <Modal
    transparent={true}
    animationType={'fade'}
    visible={isLoader}>
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator animating={isLoader} size="large" color="#FB9337" />
      </View>
    </View>
  </Modal>
);

export default Loader;