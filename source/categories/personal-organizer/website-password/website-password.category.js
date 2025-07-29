import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Modal,
  ImageBackground,
  SafeAreaView,
  Alert,
  BackHandler
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
import TitleView from '../../../components/title-view/title-view.component';
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
} from '../../../configuration/api/api.functions';
import {Color} from '../../../assets/color/color';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';
import ExternalLink from '../../../components/external-link/external-link.component';

import styles from './website-password.style';

class WebSiteAccount extends Component {
  initialState = {
    isLoader: false,
    editable: false,
    showQuestion: false,
    access_token: '',
    name: '',
    url: '',
    username: '',
    password: '',
    securityQ1: '',
    securityA1: '',
    securityQ2: '',
    securityA2: '',
    securityQ3: '',
    securityA3: '',
    notes: '',
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
    const {navigation} = this.props;
  
    // Handle Android back press
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        this.props.navigation.navigate('PersonalOrganisation');
        return true;
      }
    );
  
    // Animate when screen is focused
    this.focusListener = navigation.addListener('focus', () => {
      
  
      // Load data
      this.setState(
        {
          access_token: this.userInfo?.access_token,
        },
        () => {
          this.viewRecord();
          this.getUserInfo();
         
        }
      );
    });
  }
 

  componentWillUnmount() {
    if (this.backHandler) this.backHandler.remove();
}
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
      'WebSiteAccount',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo.access_token
    )
      .then((response) => {
        console.log('View res: ', response);
        this.setViewData(response.data);
        if (mode === 'View') {
          this.checkSecurityQuestions(response.data);
        }
        this.setState({isLoader: false});
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.setState({isLoader: false});navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
      });
    this.setState({isLoader: false});
    if (mode === 'Add') this.setState({editable: true, hideResult: false});
  };

  refreshData = () => {
    this.viewRecord()
  }

  setViewData = (data) => {
    console.log('Data: ', data);
    this.setState({
      name: data.Name,
      url: data.URL,
      username: data.UserName,
      password: data.Password,
      securityQ1: data.SecurityQuestion1,
      securityA1: data.SecurityAnswer1,
      securityQ2: data.SecurityQuestion2,
      securityA2: data.SecurityAnswer2,
      securityQ3: data.SecurityQuestion3,
      securityA3: data.SecurityAnswer3,
      notes: data.Comment,
      shareKeyId: data.shareKeyId,
      isLoader: false,
    });
  };

  checkSecurityQuestions = (data) => {
    if (
      data.SecurityQuestion1.length !== 0 ||
      data.SecurityQuestion2.length !== 0 ||
      data.SecurityQuestion3.length !== 0
    ) {
      this.setState({showQuestion: false});
    } else {
      this.setState({showQuestion: true});
    }
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
      password,
      securityQ1,
      securityA1,
      securityQ2,
      securityA2,
      securityQ3,
      securityA3,
      access_token,
      notes,
    } = this.state;
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      Name: name,
      URL: url,
      UserName: username,
      Password: password,
      SecurityQuestion1: securityQ1,
      SecurityAnswer1: securityA1,
      SecurityQuestion2: securityQ2,
      SecurityAnswer2: securityA2,
      SecurityQuestion3: securityQ3,
      SecurityAnswer3: securityA3,
      Comment: notes,
    });

    await createOrUpdateRecord('WebSiteAccount', recid, data, this.userInfo.access_token)
      .then((response) => {
        this.setState({isLoader: false});
        // navigation.goBack();
        this.props.navigation.navigate('PersonalOrganisation');
      })
      .catch((error) => {
        this.setState({isLoader: false});
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
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
      'WebSiteAccount',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo.access_token
    )
      .then((response) => this.props.navigation.navigate('PersonalOrganisation'))
      .catch((error) => {console.log('Error in delete', error)
      navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
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
      'WebSiteAccount',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo.access_token,
      data,
    )
      .then((response) => {
        this.setState({isLoader: false});
        console.log('Response', response);
        // navigation.goBack();
        this.props.navigation.navigate('PersonalOrganisation');
      })
      .catch((error) => {
        this.setState({isLoader: false});
        console.log('Error in delete', error);navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
      });
  };

  basicInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Name"
          onChangeText={(name) => this.setState({name}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.name}
          editable={this.state.editable}
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
        <View style={styles.clipboard}>
          <ExternalLink link={this.state.url} editable={this.state.editable} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Username"
          onChangeText={(username) => this.setState({username}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.username}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.username}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Password"
          onChangeText={(password) => this.setState({password}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.password}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.password}
            editable={this.state.editable}
          />
        </View>
      </View>
    </View>
  );

  securityQuestions = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Security Question 1"
          onChangeText={(securityQ1) => this.setState({securityQ1}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.securityQ1}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.securityQ1}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Answer 1"
          onChangeText={(securityA1) => this.setState({securityA1}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.securityA1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Security Question 2"
          onChangeText={(securityQ2) => this.setState({securityQ2}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.securityQ2}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.securityQ2}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Answer 2"
          onChangeText={(securityA2) => this.setState({securityA2}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.securityA2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Security Question 3"
          onChangeText={(securityQ3) => this.setState({securityQ3}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.securityQ3}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.securityQ3}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Answer 3"
          onChangeText={(securityA3) => this.setState({securityA3}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightNavyBlue}
          value={this.state.securityA3}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  notes = () => (
    <View>
      <View style={styles.inputContainer}>
        {this.state.editable ? (
          <MultilineInput
            placeholder="Note"
            onChangeText={(notes) =>
              this.setState({notes}, () => this.changesMade())
            }
            keyboardType="default"
          color={Color.lightNavyBlue}
            value={this.state.notes}
          />
        ) : (
          <Text style={styles.notes}>{this.state.notes}</Text>
        )}
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.notes}
            editable={this.state.editable}
          />
        </View>
      </View>
    </View>
  );

  editComponent = (isLoader) => (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Information</Text>
      {this.basicInformation()}
      <View style={styles.gap} />
      <View>
        {!this.state.showQuestion && (
          <View>
            <Text style={styles.title}>Security Questions</Text>
            {this.securityQuestions()}
            <View style={styles.gap} />
          </View>
        )}
      </View>
      <Text style={styles.title}>Notes</Text>
      {this.notes()}
      <View style={styles.gap} />
      <Loader isLoader={isLoader} />
    </View>
  );

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({ changes: true }, () => console.log("Check: "));
  }

  onSave = () => {
    this.submit();
    this.setState({editable: false})
  };

  onEdit = () => {
    this.setState({editable: true}, () => console.log(this.state.editable));
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
    if (changes){
      Alert.alert(
      //title
      'Save',
      //body
      'Do you want to save changes ?',
      [
        {text: 'Save', onPress: () => this.submit()},
        {text: 'Cancel', onPress: () => this.props.navigation.navigate('PersonalOrganisation'), style: 'cancel'},
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
    }else {
      // navigation.goBack();
      this.props.navigation.navigate('PersonalOrganisation');
    }
    return true
  }

  background = () =>
    require('../../../assets/jpg-images/Personal-Organisation-Background/personal-organisation-background.jpg');

  render() {
    const {isLoader, editable, shareKeyId} = this.state;
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
              style={
                styles.outerContainerView}
              keyboardShouldPersistTaps="handled">
              {this.editComponent(isLoader)}
              <SwitchKey type={'Notes'} recid={recid} shareKeyId={shareKeyId} refresh={this.refreshData}/>
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

export default connect(mapStateToProps)(WebSiteAccount);
