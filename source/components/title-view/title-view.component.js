import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Title} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './title-view.style';

class TitleView extends Component {
  toggleIcons = () => {
    const {mode, theme, type, editable} = this.props;
    switch (mode) {
      case 'Add':
        return this.add(theme, type, editable);
        break;
      case 'View':
        return editable
          ? this.view(theme, type, editable)
          : this.add(theme, type, editable);
        break;
      default:
        <View />;
        break;
    }
  };

  add = (theme, type, editable) => (
    <View style={styles.icons}>
      <TouchableOpacity onPress={() => this.saveInfo()}>
        <MaterialIcons
          name="save"
          color={theme !== 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 47, 60)'}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );

  view = (theme, type, editable) => (
    <View style={styles.icons}>
      <View style={styles.rowObject}>
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => this.editInfo()}>
          <MaterialIcons
            name="edit"
            color={theme !== 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 47, 60)'}
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconView}
          onPress={() => this.archive()}>
          <MaterialIcons
            name="archive"
            color={theme !== 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 47, 60)'}
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.deleteInfo()}>
          <MaterialIcons
            name="delete"
            color={theme !== 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 47, 60)'}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  editInfo = () => {
    this.props.edit();
  };
 
  saveInfo = () => {
    this.props.save();
  };

  deleteInfo = () => {
    this.props.delete();
  };

  archive = () => {
    this.props.archive();
  };

  back = () => {
    this.props.backpress()
  }

  render() {
    const {mode, theme, save, type, navigation, title} = this.props;
    console.log("Mode: ", mode)
    return (
      <View style={styles.rowObject}>
        <TouchableOpacity onPress={() => this.back()}>
          <MaterialIcons
            name="arrow-back"
            color={theme !== 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 47, 60)'}
            size={24}
          />
        </TouchableOpacity>
        <Title
          style={[
            styles.title,
            {
              color:
                theme !== 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 47, 60)',
            },
          ]}>
          Add {title}
        </Title>
        {this.toggleIcons()}
      </View>
    );
  }
}

export default TitleView;
