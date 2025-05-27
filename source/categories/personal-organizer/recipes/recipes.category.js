import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Modal,
  ImageBackground,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import {Text} from 'react-native-paper';
import qs from 'qs';
import {connect} from 'react-redux';
import {NativeBaseProvider} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputTextDynamic from '../../../components/input-text-dynamic/input-text-dynamic.component';
import InputTextIconDynamic from '../../../components/input-text-icon-dynamic/input-text-icon-dynamic.component';
import ModalPicker from '../../../components/modal-picker/modal-picker.component';
import Button from '../../../components/button/button.component';
import Loader from '../../../components/loader/loader.component';
import ModalScreen from '../../../components/modal/modal.component';
import TitleView from '../../../components/title-view/title-view.component';
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
} from '../../../configuration/api/api.functions';
import {cuisine} from './recipes.list';
import {Color} from '../../../assets/color/color';

import styles from './recipes.style';

class Recipies extends Component {
  initialState = {
    isLoader: false,
    editable: true,
    modal: false,
    array: [],
    key: '',
    access_token: '',
    name: '',
    url: '',
    username: '',
    passwrd: '',
    recipe: '',
    cuisine: '',
    changes: false,
    shareKeyId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
    };
  }
  userInfo = null;
  componentDidMount() {
    const {navigation, route} = this.props;
    BackHandler.addEventListener('hardwareBackPress', this.onBack);

    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      // if (this.props.userData && this.props.userData.userData)
        this.setState(
          {
            access_token: this.userInfo.access_token,
          },
          () => this.viewRecord(),
          this.getUserInfo()
        );
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', handler);
  }
  getUserInfo = async () => {
    try {
      const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
       
      }
    } catch (error) {
      console.log('Error fetching user info:', error);
    }
  }
  viewRecord = async () => {
    const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
       
      }
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
    this.setState({isLoader: true});
    await viewRecords(
      'Recipies',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo.access_token
    )
      .then((response) => {
        console.log('View res: ', response);
        this.setViewData(response.data);
        this.setState({isLoader: false});
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.setState({isLoader: false});
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
    this.setState({isLoader: false});
    if (mode === 'Add') this.setState({editable: true, hideResult: false});
  };

  refreshData = () => {
    this.viewRecord();
  };

  setViewData = (data) => {
    console.log('Data: ', data);
    this.setState({
      name: data.Name,
      url: data.URL,
      username: data.WebSiteUsername,
      passwrd: data.WebSitePassword,
      recipe: data.RecipeText,
      cuisine: data.CuisineType,
      shareKeyId: data.shareKeyId,
      isLoader: false,
    });
  };

  submit = async () => {
    const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
       
      }
    this.setState({isLoader: true});
    const {
      name,
      url,
      username,
      passwrd,
      recipe,
      cuisine,
      access_token,
    } = this.state;
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      Name: name,
      URL: url,
      WebSiteUsername: username,
      WebSitePassword: passwrd,
      RecipeText: recipe,
      CuisineType: cuisine,
    });

    await createOrUpdateRecord('Recipies', recid, data, this.userInfo.access_token)
      .then((response) => {
        this.setState({isLoader: false});
        navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoader: false});
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
  };

  delete = async () => {
    const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
       
      }
    const {navigation, route} = this.props;
    const {recid} = route.params;
    await deleteRecords(
      'Recipies',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo.access_token
    )
      .then((response) => navigation.goBack())
      .catch((error) => {
        console.log('Error in delete', error);
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
  };

  archive = async () => {
    const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
       
      }
    this.setState({isLoader: true});
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      IsArchived: true,
    });
    await archiveRecords(
      'Recipies',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo.access_token,
      data,
    )
      .then((response) => {
        this.setState({isLoader: false});
        console.log('Response', response);
        navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoader: false});
        console.log('Error in delete', error);
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
  };

  basicInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Name"
          onChangeText={(name) =>
            this.setState({name}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.cuisine.length === 0 ? 'Cuisine' : this.state.cuisine
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: cuisine,
                key: 'cuisine',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightPink}
          editable={this.state.editable}
          name="Cuisine"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="URL"
          onChangeText={(url) => this.setState({url}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.url}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Username"
          onChangeText={(username) =>
            this.setState({username}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.username}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Password"
          onChangeText={(passwrd) =>
            this.setState({passwrd}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.passwrd}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        {!this.state.editable ? (
          <MultilineInput
            placeholder="Recipe"
            onChangeText={(recipe) =>
              this.setState({recipe}, () => this.changesMade())
            }
            keyboardType="default"
            color={Color.lightNavyBlue}
            value={this.state.recipe}
          />
        ) : (
          <Text style={styles.recipe}>{this.state.recipe}</Text>
        )}
      </View>
    </View>
  );

  changeModalVisibility = (bool) => {
    this.setState({modal: bool});
  };

  changeState = (key, value) => {
    this.setState({[key]: value});
  };

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
  };

  editComponent = (isLoader, modal, array, key) => (
    <View>
      <Text style={styles.title}>Basic Information</Text>
      {this.basicInformation()}
      <Loader isLoader={isLoader} />
      <ModalScreen
        isModalVisible={modal}
        list={array}
        changeModalVisibility={this.changeModalVisibility}
        id={key}
        changeState={this.changeState}
      />
    </View>
  );

  onSave = () => {
    this.submit();
  };

  onEdit = () => {
    this.setState({editable: false}, () => console.log(this.state.editable));
  };

  onDelete = () => {
    Alert.alert(
      //title
      'Delete',
      //body
      'Are you sure you want to delete ?',
      [
        {text: 'Yes', onPress: () => this.delete()},
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  onArchive = () => {
    this.archive();
  };

  onBack = () => {
    const {navigation} = this.props;
    const {changes} = this.state;
    if (changes) {
      Alert.alert(
        //title
        'Save',
        //body
        'Do you want to save changes ?',
        [
          {text: 'Save', onPress: () => this.submit()},
          {text: 'Cancel', onPress: () => navigation.goBack(), style: 'cancel'},
        ],
        {cancelable: false},
        //clicking out side of alert will not cancel
      );
    } else {
      navigation.goBack();
    }
    return true;
  };

  background = () =>
    require('../../../assets/jpg-images/Personal-Organisation-Background/personal-organisation-background.jpg');

  render() {
    const {isLoader, modal, array, key, editable, shareKeyId} = this.state;
    const {route, navigation} = this.props;
    const {title, type, mode, recid} = route.params;
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.outerView}>
          <ImageBackground
            source={this.background()}
            style={styles.backgroundImage}>
            <View style={styles.titleView}>
              <TitleView
                navigation={navigation}
                mode={mode}
                theme={'light'}
                title={title}
                type={type}
                save={this.onSave}
                edit={this.onEdit}
                delete={this.onDelete}
                archive={this.onArchive}
                backpress={this.onBack}
                editable={editable}
              />
            </View>
            <ScrollView
              ref={(ref) => (this.scroll = ref)}
              onContentSizeChange={() => {
                this.scroll.scrollTo({y: 0});
              }}
              style={styles.outerContainerView}
              keyboardShouldPersistTaps="handled">
              <View style={styles.container}>
                {this.editComponent(isLoader, modal, array, key)}
              </View>
              <SwitchKey
                type={'Recipies'}
                recid={recid}
                shareKeyId={shareKeyId}
                refresh={this.refreshData}
              />
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
      </NativeBaseProvider>
    );
  }
}
const mapStateToProps = ({userData}) => ({
  userData,
});
export default connect(mapStateToProps)(Recipies);
