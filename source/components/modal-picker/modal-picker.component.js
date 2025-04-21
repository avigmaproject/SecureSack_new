import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {TouchableRipple} from 'react-native-paper';

import styles from './modal-picker.style';

const ModalPicker = ({label, onPress, color, editable, name}) => (
  <View style={styles.container}>
    {editable && <Text style={styles.labelText}>{name}</Text>}

    <TouchableRipple
      style={[
        !editable
          ? {
              borderBottomColor: 'rgb(33, 47, 60)',
              borderBottomWidth: 1,
            }
          : {
              borderBottomWidth: 0,
            },
      ]}
      rippleColor="rgba(0, 0, 0, .32)"
      onPress={!editable ? onPress : undefined}
    >
      <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
        <Text
          style={[
            styles.label,
            !editable
              ? {color: 'rgb(33, 47, 60)'}
              : {color: 'rgba(33, 47, 60, 0.5)'},
          ]}
        >
          {label}
        </Text>
        <Icon
          name="arrow-down"
          size={12}
          color={!editable ? 'rgb(33, 47, 60)' : 'rgba(33, 47, 60, 0.5)'}
          style={styles.icon}
        />
      </View>
    </TouchableRipple>
  </View>
);

export default ModalPicker;
