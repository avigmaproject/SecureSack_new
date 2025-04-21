import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Modal,
  SafeAreaView,
  ImageBackground,
  Alert,
  BackHandler,
} from 'react-native';
import {Text} from 'react-native-paper';
import qs from 'qs';
import {connect} from 'react-redux';
import {Root,NativeBaseProvider} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputTextDynamic from '../../../components/input-text-dynamic/input-text-dynamic.component.js';
import InputTextIconDynamic from '../../../components/input-text-icon-dynamic/input-text-icon-dynamic.component.js';
import Button from '../../../components/button/button.component';
import Loader from '../../../components/loader/loader.component';
import RefBusinessModal from '../../../components/ref-business-modal/ref-business-modal.component';
import TitleView from '../../../components/title-view/title-view.component';
import AutoCompleteText from '../../../components/auto-complete-text-input/auto-complete-text-input.component';
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
  lookupType,
} from '../../../configuration/api/api.functions';
import {formatDate} from '../../../configuration/card-formatter/card-formatter';
import {Color} from '../../../assets/color/color.js';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';
import ExternalLink from '../../../components/external-link/external-link.component';

import styles from './brokerages.style';

class BrokerageAccount extends Component {
  initialState = {
    isLoader: false,
    refBusModal: false,
    name: '',
    financialInstitution: '',
    financialInstitutionId: '',
    acNumber: '',
    username: '',
    password: '',
    url: '',
    primaryAcHolder: '',
    joinAcHolderOne: '',
    joinAcHolderTwo: '',
    securityQ1: '',
    securityA1: '',
    securityQ2: '',
    securityA2: '',
    securityQ3: '',
    securityA3: '',
    stockTransactionFee: '',
    openedOn: '',
    closedOn: '',
    notes: '',
    showQuestion: false,
    editable: true,
    hideResult: true,
    refArray: [],
    changes: false,
    shareKeyId: '',
    financialInstitutionClicked: false,
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
    navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => this.onBack());
      this.setState(this.initialState);
      if (this.props.userData && this.props.userData.userData)
        this.setState(
          {access_token:  this.userInfo?.access_token},
          () => this.viewRecord(),
          this.getBusinessEntity(),
          this.userInfo()
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
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);

  }

  viewRecord = async () => {
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
    this.setState({isLoader: true});
    await viewRecords(
      'BrokerageAccount',
      recid,
      this.userInfo?.access_token,
    )
      .then((response) => {
        console.log('View res: ', response);
        this.setViewData(response.data);
        if (mode === 'View') {
          this.checkSecurityQuestions(response.data);
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.setState({isLoader: false});
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
    if (mode === 'Add') this.setState({editable: false, hideResult: false});
  };

  refreshData = () => {
    this.viewRecord();
  };

  setViewData = (data) => {
    this.setState(
      {
        name: data.BrokerageName,
        financialInstitution: data.FinancialInstitution.label,
        financialInstitutionId: data.FinancialInstitution.id,
        acNumber: data.AccountNumber,
        username: data.WebSiteAccountNumber,
        password: data.WebSitePassword,
        url: data.URL,
        primaryAcHolder: data.PrimaryAccountHolder,
        joinAcHolderOne: data.AdditionalAccountHolder1,
        joinAcHolderTwo: data.AdditionalAccountHolder2,
        securityQ1: data.SecurityQuestion1,
        securityA1: data.SecurityAnswer1,
        securityQ2: data.SecurityQuestion2,
        securityA2: data.SecurityAnswer2,
        securityQ3: data.SecurityQuestion3,
        securityA3: data.SecurityAnswer3,
        stockTransactionFee: data.StockTransactionFee,
        openedOn: data.AccountOpeningDate,
        closedOn: data.AccountClosingDate,
        notes: data.Notes,
        isLoader: false,
        shareKeyId: data.shareKeyId,
      },
      () => this.referenceObj(),
    );
  };

  referenceObj = () => {
    const {refArray} = this.state;
    refArray
      .filter((item) => item.id === this.state.financialInstitutionId)
      .map((val) => this.setState({financialInstitution: val.label}));
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
    this.setState({isLoader: true});
    const {
      access_token,
      name,
      financialInstitution,
      financialInstitutionId,
      acNumber,
      username,
      password,
      url,
      primaryAcHolder,
      joinAcHolderOne,
      joinAcHolderTwo,
      securityQ1,
      securityA1,
      securityQ2,
      securityA2,
      securityQ3,
      securityA3,
      stockTransactionFee,
      openedOn,
      closedOn,
      notes,
    } = this.state;
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      BrokerageName: name,
      FinancialInstitution: financialInstitutionId,
      AccountNumber: acNumber,
      WebSiteAccountNumber: username,
      WebSitePassword: password,
      URL: url,
      PrimaryAccountHolder: primaryAcHolder,
      AdditionalAccountHolder1: joinAcHolderOne,
      AdditionalAccountHolder2: joinAcHolderTwo,
      SecurityQuestion1: securityQ1,
      SecurityAnswer1: securityA1,
      SecurityQuestion2: securityQ2,
      SecurityAnswer2: securityA2,
      SecurityQuestion3: securityQ3,
      SecurityAnswer3: securityA3,
      StockTransactionFee: stockTransactionFee,
      AccountOpeningDate: openedOn,
      AccountClosingDate: closedOn,
      Notes: notes,
    });
    await createOrUpdateRecord('BrokerageAccount', recid, data, access_token)
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
    const {navigation, route} = this.props;
    const {recid} = route.params;
    await deleteRecords(
      'BrokerageAccount',
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
    this.setState({isLoader: true});
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      IsArchived: true,
    });
    await archiveRecords(
      'BrokerageAccount',
      recid,
      this.userInfo?.access_token,
      data,
    )
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

  basicInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Name"
          onChangeText={(name) =>
            this.setState({name}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={[styles.inputContainer, {zIndex: 1000}]}>
        <AutoCompleteText
          placeholder="Financial Institution"
          onChangeText={(financialInstitution) =>
            this.setState(
              {
                financialInstitution,
                financialInstitution: !financialInstitution ? true : false,
              },
              () => this.changesMade(),
            )
          }
          keyboardType="default"
          color={Color.lightishBlue}
          value={this.state.financialInstitution}
          editable={this.state.editable}
          array={this.state.refArray}
          hideResult={this.state.hideResult}
          onPress={(financialInstitution) =>
            this.showAutoComplete(financialInstitution)
          }
          clicked={this.state.financialInstitution}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Account Number"
          onChangeText={(acNumber) =>
            this.setState({acNumber}, () => this.changesMade())
          }
          keyboardType="number-pad"
          color={Color.lightishBlue}
          value={this.state.acNumber}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.acNumber}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Username"
          onChangeText={(username) =>
            this.setState({username}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
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
          color={Color.lightishBlue}
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
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="URL"
          onChangeText={(url) => this.setState({url}, () => this.changesMade())}
          keyboardType="url"
          color={Color.lightishBlue}
          value={this.state.url}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <ExternalLink link={this.state.url} editable={this.state.editable} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Primary Account Holder"
          onChangeText={(primaryAcHolder) =>
            this.setState({primaryAcHolder}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
          value={this.state.primaryAcHolder}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Joint Account Holder 1"
          onChangeText={(joinAcHolderOne) =>
            this.setState({joinAcHolderOne}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
          value={this.state.joinAcHolderOne}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Joint Account Holder 2"
          onChangeText={(joinAcHolderTwo) =>
            this.setState({joinAcHolderTwo}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
          value={this.state.joinAcHolderTwo}
          editable={this.state.editable}
        />
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
          color={Color.lightishBlue}
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
          onChangeText={(securityA1) =>
            this.setState({securityA1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
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
          color={Color.lightishBlue}
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
          onChangeText={(securityA2) =>
            this.setState({securityA2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
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
          color={Color.lightishBlue}
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
          onChangeText={(securityA3) =>
            this.setState({securityA3}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
          value={this.state.securityA3}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  additionalInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Stock Transaction Fee"
          onChangeText={(stockTransactionFee) =>
            this.setState({stockTransactionFee}, () => this.changesMade())
          }
          icon="dollar-sign"
          keyboardType="number-pad"
          color={Color.lightishBlue}
          value={this.state.stockTransactionFee}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Opened On"
            onChangeText={(openedOn) =>
              this.setState({openedOn: formatDate(openedOn)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="number-pad"
            color={Color.lightishBlue}
            value={this.state.openedOn}
            editable={this.state.editable}
            example="MM/DD/YYYY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="Closed On"
            onChangeText={(closedOn) =>
              this.setState({closedOn: formatDate(closedOn)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="number-pad"
            color={Color.lightishBlue}
            value={this.state.closedOn}
            editable={this.state.editable}
            example="MM/DD/YYYY"
          />
        </View>
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
            color={Color.lightishBlue}
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

  editComponent = (isLoader, editable, refBusModal) => (
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
      <Text style={styles.title}>Additional Information</Text>
      {this.additionalInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>Notes</Text>
      {this.notes()}
      <View style={styles.gap} />
      <Loader isLoader={isLoader} />
      <RefBusinessModal
        isModalVisible={refBusModal}
        changeModalVisibility={this.changeRefBusinessmModal}
        access_token={ this.userInfo?.access_token}
        refreshingList={this.refreshingList}
      />
    </View>
  );

  getBusinessEntity = async () => {
    const {userData} = this.props;
    if (userData !== null) {
      await lookupType( this.userInfo?.access_token, 'RefBusinessEntity')
        .then((response) => {
          response.pop();
          this.setState({refArray: response});
        })
        .catch((error) => console.log('Ref Business error: ', error));
    }
  };

  showAutoComplete = (val) => {
    if (val.label === 'Add')
      this.setState({refBusModal: true, financialInstitution: true});
    else {
      this.setState(
        {
          financialInstitution: val.label,
          financialInstitutionId: val.id,
        },
        () => this.setState({hideResult: true, financialInstitution: true}),
      );
    }
  };

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
  };

  onSave = () => {
    this.submit();
  };

  onEdit = () => {
    this.setState({editable: false});
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

  background = () =>
    require('../../../assets/jpg-images/Financial-Data-Background/financial-data-background.jpg');

  render() {
    const {isLoader, editable, refBusModal, shareKeyId} = this.state;
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
              style={styles.outerContainerView}
              keyboardShouldPersistTaps="handled">
              <View style={styles.container}>
                {this.editComponent(isLoader, editable, refBusModal)}
              </View>
              <SwitchKey
                type={'BrokerageAccount'}
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

export default connect(mapStateToProps)(BrokerageAccount);
