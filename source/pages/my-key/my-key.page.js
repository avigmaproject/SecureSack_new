import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text, Title, Caption, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputTextAdd from '../../components/input-text-add/input-text-add.component';
import {updateKey, deleteKeys} from '../../configuration/api/api.functions';
import Button from '../../components/button/button.component';
import DeleteKeyModal from '../../components/delete-key-modal/delete-key-modal.component';

import styles from './my-key.style';

class MyKey extends Component {
  initialState = {
    editors: [],
    viewers: [],
    edit: '',
    view: '',
    modal: false,
    replacementKey: '',
  };
  constructor() {
    super();
    this.state = {
      ...this.initialState,
    };
  }
  userInfo = null;
  getUserInfo = async () => {
    try {
      const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
        console.log('User Info stored in variable:', this.userInfo);
      }
    } catch (error) {
      console.log('Error fetching user info:', error);
    }
  };
  componentDidMount() {
    const {navigation, route} = this.props;
    const {data} = route.params;
    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      this.cloneArray(data);
      this.getUserInfo()
    });
  }

  cloneArray = (data) => {
    let earr = [];
    let varr = [];
    if (data.editors) {
      data.editors.map((e) => {
        earr.push(e.email);
      });
    }
    if (data.viewers) {
      data.viewers.map((e) => {
        varr.push(e.email);
      });
    }
    this.setState({editors: [...earr], viewers: [...varr]});
  };

  editArray = () => {
    const {edit} = this.state;
    if (edit.length !== 0) {
      this.state.editors.push(edit);
      this.setState({edit: ''});
    }
  };

  viewerArray = () => {
    const {view} = this.state;
    if (view.length !== 0) {
      this.state.viewers.push(view);
      this.setState({view: ''});
    }
  };

  removeElement = (item, array, flag) => {
    let index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }
    console.log('Arr: ', array);
    flag === 'edit'
      ? this.setState({editors: array})
      : this.setState({viewers: array});
  };

  addEditorsViewers = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      // console.log('User Info stored in variable:', this.userInfo);
    }
      
    
    const {navigation, route} = this.props;
    const {data} = route.params;
    console.log("data",data)
    const {editors, viewers} = this.state;
    if (editors.length !== 0 || viewers.length !== 0) {
      let apidata = JSON.stringify({
        name: data.name,
        editors: editors,
        viewers: viewers,
      });
      console.log(
        'access_token: ',
     
        this.userInfo?.access_token,
     
      );
      await updateKey(
        this.userInfo?.access_token,
        data.id,
        apidata,
      )
        .then((response) => {
          console.log('Update response: ', response);
          navigation.goBack();
        })
        .catch((error) => alert("Please enter valid email."));
    }
  };

  changeModalVisibility = () => {
    this.setState({modal: false});
  };

  getReplaceKey = (key) => {
    this.confirmationModal(key);
  };

  confirmationModal = (key) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete?',
      [{text: 'DELETE', onPress: () => this.deleteKey(key)}, {text: 'CANCEL'}],
      {cancelable: false},
    );
  };

  deleteKey = async (replacementKey) => {
    const {navigation, route} = this.props;
    const {data} = route.params;
    let apidata = qs.stringify({
      deleteKeyId: data.id,
      replacementKeyId: replacementKey,
    });
    console.log('DataSh: ', apidata);
    await deleteKeys(this.userInfo?.access_token, apidata)
      .then((response) => {
        console.log('Res: ', response);
        navigation.goBack();
      })
      .catch((error) => console.log('Error in delete api: ', error));
  };

  editors = () => (
    <>
      <FlatList
        data={this.state.editors}
        renderItem={({item}) => this.chip(item, this.state.editors, 'edit')}
        numColumns={1}
      />
      <View style={styles.inputView}>
        <InputTextAdd
          placeholder="Editors"
          onChangeText={(edit) => this.setState({edit})}
          value={this.state.edit}
          onAdd={() => this.editArray()}
        />
      </View>
    </>
  );

  viewers = () => (
    <>
      <FlatList
        data={this.state.viewers}
        renderItem={({item}) => this.chip(item, this.state.viewers, 'view')}
        numColumns={1}
      />
      <View style={styles.inputView}>
        <InputTextAdd
          placeholder="Viewers"
          onChangeText={(view) => this.setState({view})}
          value={this.state.view}
          onAdd={() => this.viewerArray()}
        />
      </View>
    </>
  );

  chip = (item, arr, flag) => (
    <View style={styles.row}>
      <Chip
        onPress={() => {
          this.removeElement(item, arr, flag);
        }}
        style={styles.tiny}
        closeIconAccessibilityLabel="Close icon accessibility label"
        icon={({size, color}) => (
          <Icon name="close" color={color} size={size} />
        )}>
        {item}
      </Chip>
    </View>
  );

  headerButton = (icon, title, navigation) => (
    <View style={styles.titleView}>
      <View style={styles.rowObject}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name="arrow-back" color="rgb(33, 47, 60)" size={24} />
        </TouchableOpacity>
        <Title style={styles.titl}>{title}</Title>
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => this.setState({modal: true})}>
            <Icons name={icon} color={'rgb(33, 47, 60)'} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  render() {
    const {navigation, route} = this.props;
    const {modal} = this.state;
    const {data, keyList} = route.params;
    console.log('Data: ', JSON.stringify(keyList));
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            {this.headerButton('delete', 'My Key', navigation)}
            <View style={styles.header}>
              <Title style={styles.title}>{data.name}</Title>
              <Caption style={styles.caption}>{data.code}</Caption>
            </View>
            <Text style={styles.text}>Editors</Text>
            {this.editors()}
            <Text style={styles.text}>Viewers</Text>
            {this.viewers()}
            <View style={styles.inputView}>
              <Button onPress={() => this.addEditorsViewers()} title="Save" />
            </View>
            <DeleteKeyModal
              isModalVisible={modal}
              list={keyList}
              changeModalVisibility={this.changeModalVisibility}
              getReplaceKey={this.getReplaceKey}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({userData}) => ({
  userData,
});

export default connect(mapStateToProps)(MyKey);
