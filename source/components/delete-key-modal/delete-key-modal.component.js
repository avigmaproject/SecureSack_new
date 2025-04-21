import React, {Component} from 'react';
import {View, Modal, FlatList, TouchableOpacity} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';

import styles from './delete-key-modal.style';

class DeleteKeyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  displayLabel = (item) => (
    <TouchableRipple
      rippleColor="rgba(0, 0, 0, .32)"
      onPress={() => this.addValue(item)}>
      <View style={styles.labelView}>
        <Text style={styles.label}> {item.name} </Text>
      </View>
    </TouchableRipple>
  );

  addValue = (item) => {
    console.log('Id: ', item);
    const {getReplaceKey} = this.props;
    getReplaceKey(item.id);
    this.closeModal();
  };

  closeModal = () => {
    const {changeModalVisibility} = this.props;
    changeModalVisibility(false);
  };

  render() {
    const {isModalVisible, list} = this.props;
    console.log('List: ', JSON.stringify(list));

    return (
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          onPressOut={() => this.closeModal()}>
          <View style={styles.modalList}>
            {list.length !== 0 ? (
              <>
                <Text style={styles.label}>
                  {' '}
                  Please select replacement key{' '}
                </Text>
                <FlatList
                  data={list}
                  renderItem={({item}) => this.displayLabel(item)}
                />
              </>
            ) : (
              <View style={styles.labelView}>
                <Text style={styles.label}> No Current Data </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

export default DeleteKeyModal;
