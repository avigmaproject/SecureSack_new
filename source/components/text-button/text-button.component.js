import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from 'native-base';

import styles from './text-button.style';

const TextButton = ({ title, onPress, labelStyle }) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.label}> {title} </Text>
    </TouchableOpacity>
);

export default TextButton;
