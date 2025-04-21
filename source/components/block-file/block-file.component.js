import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Menu, Caption, Text} from 'react-native-paper';

import styles from './block-file.style';

class BlockFile extends Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
    };
  }

  popUpMenu = (onInfo, onDelete, onEdit, onDownload, item) => (
    <Menu
      visible={this.state.showMenu}
      onDismiss={() => this.setState({showMenu: false})}
      anchor={
        <TouchableOpacity onPress={() => this.setState({showMenu: true})}>
          <Entypo name="dots-three-vertical" color="#000000" size={20} />
        </TouchableOpacity>
      }>
      <Menu.Item
        onPress={() => this.setState({showMenu: false}, () => onDelete(item))}
        title="Delete"
      />
      <Menu.Item
        onPress={() => this.setState({showMenu: false}, () => onEdit(item))}
        title="Edit"
      />
      <Menu.Item
        onPress={() => this.setState({showMenu: false}, () => onDownload(item))}
        title="Download"
      />
    </Menu>
  );

  render() {
    const {item, onInfo, onDelete, onEdit, onDownload} = this.props;
    console.log('Items: ', this.state.showMenu);
    return (
      <View style={styles.container}>
        <View style={styles.fileContainer}>
          <View style={styles.icon}>
            {this.popUpMenu(onInfo, onDelete, onEdit, onDownload, item)}
          </View>
          <View style={styles.fileInnerContainer}>
            <TouchableOpacity onPress={onDownload}>
              <Icons name="insert-drive-file" color="#FB9337" size={40} />
            </TouchableOpacity>
            <Text style={styles.fileName}>{item.item.name}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default BlockFile;
