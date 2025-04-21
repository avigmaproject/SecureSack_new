import React from 'react';
import {View, FlatList} from 'react-native';
import {Text, Caption} from 'react-native-paper'
import Icons from 'react-native-vector-icons/MaterialIcons';

import styles from './file-selected.style';

const FileSelected = ({ fileList }) => (
    <View>
        <FlatList
          data={fileList}
          renderItem={(item, id) => selectedFile(item)}
        />
    </View>
)

const selectedFile = (item) => (
    <View style={styles.container}>
        <View style={[styles.selectedFile, styles.row]}>
            <View style={styles.circle}>
                <Icons name="insert-drive-file" color="#FFFFFF" size={25} />
            </View>
            <Text style={styles.fileName}>{item.item.doc}</Text>
        </View>
    </View>
)

export default FileSelected;