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
import InputTextDynamic from '../../../components/input-text-dynamic/input-text-dynamic.component.js';
import InputTextIconDynamic from '../../../components/input-text-icon-dynamic/input-text-icon-dynamic.component.js';
import ModalPicker from '../../../components/modal-picker/modal-picker.component.js';
import Button from '../../../components/button/button.component';
import Loader from '../../../components/loader/loader.component';
import ModalScreen from '../../../components/modal/modal.component';
import RefBusinessModal from '../../../components/ref-business-modal/ref-business-modal.component';
import TitleView from '../../../components/title-view/title-view.component';
import AutoCompleteText from '../../../components/auto-complete-text-input/auto-complete-text-input.component';
import AutoComplete from 'react-native-autocomplete-input';
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
  lookupType,
} from '../../../configuration/api/api.functions';
import {reward_type} from './rewards-programs.list';
import {Color} from '../../../assets/color/color.js';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';
import ExternalLink from '../../../components/external-link/external-link.component';

import styles from './rewards-programs.style';

class RewardProgram extends Component {
  initialState = {
    isLoader: false,
    modal: false,
    refBusModal: false,
    array: [],
    key: '',
    access_token: '',
    name: '',
    issuer: '',
    issuerId: '',
    accountNo: '',
    numOfPoints: '',
    url: '',
    username: '',
    password: '',
    securityQ1: '',
    securityA1: '',
    securityQ2: '',
    securityA2: '',
    securityQ3: '',
    securityA3: '',
    programType: '',
    notes: '',
    editable: true,
    refArray: [],
    showQuestion: false,
    changes: false,
    shareKeyId: '',
    hideResult: false,
    issuerClicked: false,
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
           access_token:this.userInfo?.access_token,
          },
          () => this.viewRecord(),
          this.getBusinessEntity(),
          this.getUserInfo()
        );
    });
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
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', handler);
  }

  viewRecord = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
    console.log({mode});
    this.setState({isLoader: true});
    await viewRecords(
      'RewardProgram',
      recid,
      this.userInfo?.access_token,
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
    this.setState(
      {
        name: data.Name,
        issuer: data.Issuer.label,
        issuerId: data.Issuer.id,
        accountNo: data.AccountNumber,
        numOfPoints: data.NumberOfPoints,
        url: data.URL,
        username: data.WebSiteUserName,
        password: data.WebSitePassword,
        securityQ1: data.SecurityQuestion1,
        securityA1: data.SecurityAnswer1,
        securityQ2: data.SecurityQuestion2,
        securityA2: data.SecurityAnswer2,
        securityQ3: data.SecurityQuestion3,
        securityA3: data.SecurityAnswer3,
        programType: data.ProgramType,
        notes: data.Notes,
        shareKeyId: data.shareKeyId,
        isLoader: false,
      },
      () => this.referenceObj(),
    );
  };

  referenceObj = () => {
    const {refArray} = this.state;
    refArray
      .filter((item) => item.id === this.state.issuingBankId)
      .map((val) => this.setState({issuer: val.label}));
  };

  getBusinessEntity = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    // const {userData} = this.props;
    // if (userData !== null) {
      await lookupType( this.userInfo?.access_token, 'RefBusinessEntity')
        .then((response) => {
          response.pop();
          this.setState({refArray: response});
        })
        .catch((error) => console.log('Ref Business error: ', error));
    // }
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
    console.log("submit=>")
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
     
    }
    this.setState({isLoader: true});
    const {
      access_token,
      name,
      issuerId,
      accountNo,
      numOfPoints,
      url,
      username,
      password,
      securityQ1,
      securityA1,
      securityQ2,
      securityA2,
      securityQ3,
      securityA3,
      programType,
      notes,
    } = this.state;
    const {navigation, route} = this.props;
    const {recid} = route.params;

    let data = qs.stringify({
      Name: name,
      Issuer: issuerId,
      AccountNumber: accountNo,
      NumberOfPoints: numOfPoints,
      URL: url,
      WebSiteUserName: username,
      WebSitePassword: password,
      SecurityQuestion1: securityQ1,
      SecurityAnswer1: securityA1,
      SecurityQuestion2: securityQ2,
      SecurityAnswer2: securityA2,
      SecurityQuestion3: securityQ3,
      SecurityAnswer3: securityA3,
      ProgramType: programType,
      Notes: notes,
    });

    await createOrUpdateRecord('RewardProgram', recid, data,this.userInfo?.access_token)
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
      console.log('User Info stored in variable:', this.userInfo);
    }
    const {navigation, route} = this.props;
    const {recid} = route.params;
    await deleteRecords(
      'RewardProgram',
      recid,
      this.userInfo?.access_token,
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
      console.log('User Info stored in variable:', this.userInfo);
    }
    this.setState({isLoader: true});
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      IsArchived: true,
    });
    await archiveRecords(
      'RewardProgram',
      recid,
      this.userInfo?.access_token,
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
          color={Color.veryLightBlue}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={[styles.inputContainer, {zIndex: 1000}]}>
        <AutoCompleteText
          placeholder="Issuer"
          onChangeText={(issuer) =>
            this.setState({issuer, issuerClicked: !issuer ? true : false}, () =>
              this.changesMade(),
            )
          }
          keyboardType="default"
          value={this.state.issuer}
          color={Color.veryLightBlue}
          editable={this.state.editable}
          array={this.state.refArray}
          onPress={(issuer) => this.showAutoComplete(issuer)}
          clicked={this.state.issuerClicked}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Account Number"
          onChangeText={(accountNo) =>
            this.setState({accountNo}, () => this.changesMade())
          }
          keyboardType="number-pad"
          color={Color.veryLightBlue}
          value={this.state.accountNo}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.accountNo}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Number of Points"
          onChangeText={(numOfPoints) =>
            this.setState({numOfPoints}, () => this.changesMade())
          }
          keyboardType="number-pad"
          color={Color.veryLightBlue}
          value={this.state.numOfPoints}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.programType.length === 0
              ? 'Type'
              : this.state.programType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: reward_type,
                key: 'programType',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightBlue}
          // editable={this.state.editable}
          editable={false}
          name="Type"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="URL"
          onChangeText={(url) => this.setState({url}, () => this.changesMade())}
          keyboardType="default"
          color={Color.veryLightBlue}
          value={this.state.url}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <ExternalLink link={this.state.url} editable={this.state.editable} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="User Name"
          onChangeText={(username) =>
            this.setState({username}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
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
          onChangeText={(password) =>
            this.setState({password}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
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
          onChangeText={(securityQ1) =>
            this.setState({securityQ1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
          value={this.state.securityQ1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Answer 1"
          onChangeText={(securityA1) =>
            this.setState({securityA1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
          value={this.state.securityA1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Security Question 2"
          onChangeText={(securityQ2) =>
            this.setState({securityQ2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
          value={this.state.securityQ2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Answer 2"
          onChangeText={(securityA2) =>
            this.setState({securityA2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
          value={this.state.securityA2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Security Question 3"
          onChangeText={(securityQ3) =>
            this.setState({securityQ3}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
          value={this.state.securityQ3}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Answer 3"
          onChangeText={(securityA3) =>
            this.setState({securityA3}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
          value={this.state.securityA3}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  notes = () => (
    <View>
      <View style={styles.inputContainer}>
        {!this.state.editable ? (
          <MultilineInput
            placeholder="Note"
            onChangeText={(notes) =>
              this.setState({notes}, () => this.changesMade())
            }
            keyboardType="default"
            color={Color.veryLightBlue}
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

  changeRefBusinessmModal = (bool) => {
    this.setState({refBusModal: bool});
  };

  refreshingList = () => {
    this.getBusinessEntity();
  };

  showAutoComplete = (issuer) => {
    console.log('sssss', {issuer});
    if (issuer.label === 'Add')
      this.setState({refBusModal: true, issuerClicked: true});
    else {
      this.setState(
        {
          issuer: issuer.label,
          issuerId: issuer.id,
        },
        () => this.setState({hideResult: true, issuerClicked: true}),
      );
    }
  };

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

  editComponent = (isLoader, modal, array, key, refBusModal) => (
    <View>
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
      <Loader isLoader={isLoader} />
      <ModalScreen
        isModalVisible={modal}
        list={array}
        changeModalVisibility={this.changeModalVisibility}
        id={key}
        changeState={this.changeState}
      />
      <RefBusinessModal
        isModalVisible={this.state.refBusModal}
        changeModalVisibility={this.changeRefBusinessmModal}
        access_token={ this.userInfo?.access_token}
        refreshingList={this.refreshingList}
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
    require('../../../assets/jpg-images/Service-Reward-Background/service-and-reward-background.jpg');

  render() {
    const {
      isLoader,
      modal,
      array,
      key,
      editable,
      refBusModal,
      shareKeyId,
    } = this.state;
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
                theme={'dark'}
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
                {this.editComponent(
                  isLoader,
                  modal,
                  array,
                  key,
                  editable,
                  refBusModal,
                )}
              </View>
              <SwitchKey
                type={'RewardProgram'}
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

export default connect(mapStateToProps)(RewardProgram);
