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
import {Root} from 'native-base';

import InputTextDynamic from '../../../components/input-text-dynamic/input-text-dynamic.component.js';
import InputTextIconDynamic from '../../../components/input-text-icon-dynamic/input-text-icon-dynamic.component.js';
import ModalPicker from '../../../components/modal-picker/modal-picker.component.js';
import TitleView from '../../../components/title-view/title-view.component';
import Button from '../../../components/button/button.component';
import ModalScreen from '../../../components/modal/modal.component';
import RefBusinessModal from '../../../components/ref-business-modal/ref-business-modal.component';
import Loader from '../../../components/loader/loader.component';
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
import {boolean_value} from './property.list';
import {formatDate} from '../../../configuration/card-formatter/card-formatter';
import {Color} from '../../../assets/color/color';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';
import ExternalLink from '../../../components/external-link/external-link.component';

import styles from './property.style';

class PropertyInsurance extends Component {
  initialState = {
    isLoader: false,
    editable: true,
    refBusModal: false,
    array: [],
    refArray: [],
    modal: '',
    access_token: '',
    name: '',
    policyNo: '',
    policyHolder: '',
    issuer: '',
    installmentAmnt: '',
    url: '',
    username: '',
    password: '',
    county: '',
    parcelNo: '',
    effectiveFrom: '',
    dwellingCoverage: '',
    liabilityCoverage: '',
    medicalPayment: '',
    dwellingCoverageDeductoble: '',
    lossOfCoverage: '',
    ordianceCoverage: '',
    personalItemInsured: '',
    jointPolicyHolderTwo: '',
    jointPolicyHolderThree: '',
    escrowAccount: '',
    replacementContentCoverage: '',
    lossAssessmentCoverage: '',
    sewerBackupCoverage: '',
    ownedProperty: '',
    ownedPropertyArr: [],
    issuerId: '',
    notes: '',
    changes: false,
    shareKeyId: '',
    issuerClicked: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    const {navigation, route} = this.props;
    BackHandler.addEventListener('hardwareBackPress', () => this.onBack());
    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      if (this.props.userData && this.props.userData.userData)
        this.setState(
          {
            access_token: this.props.userData.userData.access_token,
          },
          () => this.viewRecord(),
          this.getBusinessEntity(),
          this.getOwnedProperty(),
        );
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', handler);
  }

  getOwnedProperty = async () => {
    const {userData} = this.props;
    if (userData !== null) {
      await lookupType(userData.userData.access_token, 'Property')
        .then((response) => {
          console.log('Response credit card: ', response);
          this.setState({ownedPropertyArr: response});
        })
        .catch((error) => console.log('Ref Credit card error: ', error));
    }
  };

  getOwnedPropertyId = (ownedProperty) => {
    let {ownedPropertyArr} = this.state;
    let ownedRef = '';
    ownedPropertyArr
      .filter((item) => item.label === ownedProperty)
      .map((val) => {
        ownedRef = val.id;
      });
    return ownedRef;
  };

  refreshData = () => {
    this.viewRecord();
  };

  viewRecord = async () => {
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
    this.setState({isLoader: true});
    await viewRecords(
      'PropertyInsurance',
      recid,
      this.props.userData.userData.access_token,
    )
      .then((response) => {
        console.log('View res: ', response);
        this.setViewData(response.data);
        this.setState({isLoader: false});
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.setState({isLoader: false});
      });
    this.setState({isLoader: false});
    if (mode === 'Add') this.setState({editable: false, hideResult: false});
  };

  setViewData = (data) => {
    console.log('Data: ', data);
    this.setState(
      {
        name: data.Name,
        policyNo: data.PolicyNumber,
        policyHolder: data.PrimaryPolicyHolder,
        issuer: data.Issuer.label,
        issuerId: data.Issuer.id,
        installmentAmnt: data.InstallmentAccount,
        url: data.URL,
        username: data.WebSiteUserName,
        password: data.WebSitePassword,
        county: data.County,
        parcelNo: data.PropertyParcelNumber,
        effectiveFrom: data.StartDate,
        dwellingCoverage: data.DwellingCoverage,
        liabilityCoverage: data.LiabilityCoverage,
        medicalPayment: data.MedicalPaymentCoverage,
        dwellingCoverageDeductoble: data.DwellingCoverageDeductible,
        lossOfCoverage: data.LossOfUseCoverage,
        ordianceCoverage: data.OrdianceAndLawCoverage,
        personalItemInsured: data.PersonalItemsInsured,
        jointPolicyHolderTwo: data.AdditionalPolicyHolder1,
        jointPolicyHolderThree: data.AdditionalPolicyHolder2,
        escrowAccount: data.EscrowAccount ? 'Yes' : 'No',
        replacementContentCoverage: data.ReplacementOfContentsCoverage
          ? 'Yes'
          : 'No',
        lossAssessmentCoverage: data.LossAssessmentCoverage ? 'Yes' : 'No',
        sewerBackupCoverage: data.SewerWaterBackupCoverage ? 'Yes' : 'No',
        ownedProperty:
          data.OwnedProperty.label === undefined
            ? ''
            : data.OwnedProperty.label,
        notes: data.Note,
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
    const {userData} = this.props;
    if (userData !== null) {
      await lookupType(userData.userData.access_token, 'RefBusinessEntity')
        .then((response) => {
          response.pop();
          this.setState({refArray: response});
        })
        .catch((error) => console.log('Ref Business error: ', error));
    }
  };

  submit = async () => {
    this.setState({isLoader: true});
    const {
      name,
      policyNo,
      policyHolder,
      issuerId,
      installmentAmnt,
      url,
      username,
      password,
      county,
      parcelNo,
      effectiveFrom,
      dwellingCoverage,
      liabilityCoverage,
      medicalPayment,
      dwellingCoverageDeductoble,
      lossOfCoverage,
      ordianceCoverage,
      personalItemInsured,
      jointPolicyHolderTwo,
      jointPolicyHolderThree,
      escrowAccount,
      replacementContentCoverage,
      lossAssessmentCoverage,
      sewerBackupCoverage,
      access_token,
      ownedProperty,
      notes,
    } = this.state;

    const {navigation, route} = this.props;
    const {recid} = route.params;

    let data = qs.stringify({
      Name: name,
      PolicyNumber: policyNo,
      PrimaryPolicyHolder: policyHolder,
      Issuer: issuerId,
      InstallmentAccount: installmentAmnt,
      URL: url,
      WebSiteUserName: username,
      WebSitePassword: password,
      County: county,
      PropertyParcelNumber: parcelNo,
      StartDate: effectiveFrom,
      DwellingCoverage: dwellingCoverage,
      LiabilityCoverage: liabilityCoverage,
      MedicalPaymentCoverage: medicalPayment,
      DwellingCoverageDeductible: dwellingCoverageDeductoble,
      LossOfUseCoverage: lossOfCoverage,
      OrdianceAndLawCoverage: ordianceCoverage,
      PersonalItemsInsured: personalItemInsured,
      AdditionalPolicyHolder1: jointPolicyHolderTwo,
      AdditionalPolicyHolder2: jointPolicyHolderThree,
      EscrowAccount: escrowAccount === 'Yes' ? true : false,
      ReplacementOfContentsCoverage:
        replacementContentCoverage === 'Yes' ? true : false,
      LossAssessmentCoverage: lossAssessmentCoverage === 'Yes' ? true : false,
      SewerWaterBackupCoverage: sewerBackupCoverage === 'Yes' ? true : false,
      OwnedProperty: this.getOwnedPropertyId(ownedProperty),
      Note: notes,
    });

    await createOrUpdateRecord('PropertyInsurance', recid, data, access_token)
      .then((response) => {
        this.setState({isLoader: false});
        navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoader: false});
      });
  };

  delete = async () => {
    const {navigation, route} = this.props;
    const {recid} = route.params;
    await deleteRecords(
      'PropertyInsurance',
      recid,
      this.props.userData.userData.access_token,
    )
      .then((response) => navigation.goBack())
      .catch((error) => console.log('Error in delete', error));
  };

  archive = async () => {
    this.setState({isLoader: true});
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      IsArchived: true,
    });
    await archiveRecords(
      'PropertyInsurance',
      recid,
      this.props.userData.userData.access_token,
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
          color={Color.veryLightPink}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Policy Number"
          onChangeText={(policyNo) =>
            this.setState({policyNo}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.policyNo}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.policyNo}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Policy Holder"
          onChangeText={(policyHolder) =>
            this.setState({policyHolder}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.policyHolder}
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
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Installment Amount"
            onChangeText={(installmentAmnt) =>
              this.setState({installmentAmnt}, () => this.changesMade())
            }
            keyboardType="default"
            color={Color.veryLightPink}
            value={this.state.installmentAmnt}
            editable={this.state.editable}
          />
        </View>
        <View style={styles.miniInputContainer}>
          <ModalPicker
            label={
              this.state.escrowAccount.length === 0
                ? 'Escrow Account'
                : this.state.escrowAccount
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: boolean_value,
                  key: 'escrowAccount',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Escrow Account"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="URL"
          onChangeText={(url) => this.setState({url}, () => this.changesMade())}
          keyboardType="default"
          color={Color.veryLightPink}
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
          onChangeText={(username) =>
            this.setState({username}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
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
          color={Color.veryLightPink}
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

  propertyDetails = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="County"
          onChangeText={(county) =>
            this.setState({county}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.county}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Parcel Number"
          onChangeText={(parcelNo) =>
            this.setState({parcelNo}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.parcelNo}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Effective From"
            onChangeText={(effectiveFrom) =>
              this.setState({effectiveFrom: formatDate(effectiveFrom)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="default"
            color={Color.veryLightPink}
            value={this.state.effectiveFrom}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <ModalPicker
            label={
              this.state.ownedProperty.length === 0
                ? 'Owned Property'
                : this.state.ownedProperty
            }
            onPress={() => this.filterOwnedProperty()}
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Owned Property"
          />
        </View>
      </View>
    </View>
  );

  filterOwnedProperty = () => {
    const {ownedPropertyArr} = this.state;
    let arr = [];
    ownedPropertyArr.map((label) => {
      arr.push(label.label);
    });
    this.setState(
      {
        modal: true,
        array: arr,
        key: 'ownedProperty',
      },
      () => this.changesMade(),
    );
  };

  insuranceDetails = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Dwelling Coverage (A)"
          onChangeText={(dwellingCoverage) =>
            this.setState({dwellingCoverage}, () => this.changesMade())
          }
          color={Color.veryLightPink}
          value={this.state.dwellingCoverage}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Liability Coverage (B)"
          onChangeText={(liabilityCoverage) =>
            this.setState({liabilityCoverage}, () => this.changesMade())
          }
          color={Color.veryLightPink}
          value={this.state.liabilityCoverage}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Medical Payment Coverage (C)"
          onChangeText={(medicalPayment) =>
            this.setState({medicalPayment}, () => this.changesMade())
          }
          color={Color.veryLightPink}
          value={this.state.medicalPayment}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Dwelling Coverage Deductible"
          onChangeText={(dwellingCoverageDeductoble) =>
            this.setState({dwellingCoverageDeductoble}, () =>
              this.changesMade(),
            )
          }
          color={Color.veryLightPink}
          value={this.state.dwellingCoverageDeductoble}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Loss of Use Coverage (F)"
          onChangeText={(lossOfCoverage) =>
            this.setState({lossOfCoverage}, () => this.changesMade())
          }
          color={Color.veryLightPink}
          value={this.state.lossOfCoverage}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <ModalPicker
            label={
              this.state.replacementContentCoverage.length === 0
                ? 'Replacement of Contents Coverage'
                : this.state.replacementContentCoverage
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: boolean_value,
                  key: 'replacementContentCoverage',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Replacement of Contents Coverage"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <ModalPicker
            label={
              this.state.lossAssessmentCoverage.length === 0
                ? 'Loss Assessment Coverage'
                : this.state.lossAssessmentCoverage
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: boolean_value,
                  key: 'lossAssessmentCoverage',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Loss Assessment Coverage"
          />
        </View>
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <ModalPicker
            label={
              this.state.sewerBackupCoverage.length === 0
                ? 'Sewer Backup Coverage'
                : this.state.sewerBackupCoverage
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: boolean_value,
                  key: 'sewerBackupCoverage',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Sewer Backup Coverage"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextIconDynamic
            placeholder="Ordiance/Legal Coverage"
            onChangeText={(ordianceCoverage) =>
              this.setState({ordianceCoverage}, () => this.changesMade())
            }
            color={Color.veryLightPink}
            value={this.state.ordianceCoverage}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Personal Items Insured"
          onChangeText={(personalItemInsured) =>
            this.setState({personalItemInsured}, () => this.changesMade())
          }
          color={Color.veryLightPink}
          value={this.state.personalItemInsured}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  additionalInfo = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Joint Policy Holder 2"
          onChangeText={(jointPolicyHolderTwo) =>
            this.setState({jointPolicyHolderTwo}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.jointPolicyHolderTwo}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Joint Policy Holder 3"
          onChangeText={(jointPolicyHolderThree) =>
            this.setState({jointPolicyHolderThree}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.jointPolicyHolderThree}
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
            color={Color.veryLightPink}
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

  changeModalVisibility = (bool) => {
    this.setState({modal: bool});
  };

  changeRefBusinessmModal = (bool) => {
    this.setState({refBusModal: bool});
  };

  refreshingList = () => {
    this.getBusinessEntity();
  };

  showAutoComplete = (issuer) => {
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

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
  };

  changeState = (key, value) => {
    this.setState({[key]: value});
  };

  editComponent = (isLoader, modal, array, key, editable) => (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Information</Text>
      {this.basicInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>Property Details</Text>
      {this.propertyDetails()}
      <View style={styles.gap} />
      <Text style={styles.title}>Insurance Details</Text>
      {this.insuranceDetails()}
      <View style={styles.gap} />
      <Text style={styles.title}>Additional Information</Text>
      {this.additionalInfo()}
      <View style={styles.gap} />
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
        access_token={this.props.userData.userData.access_token}
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
    require('../../../assets/jpg-images/Insurance-Background/insurance-background.jpg');

  render() {
    const {isLoader, modal, array, key, editable, shareKeyId} = this.state;
    const {route, navigation} = this.props;
    const {title, type, background, theme, mode, recid} = route.params;
    return (
      <Root>
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
                {this.editComponent(isLoader, modal, array, key, editable)}
              </View>
              <SwitchKey
                type={'PropertyInsurance'}
                recid={recid}
                shareKeyId={shareKeyId}
                refresh={this.refreshData}
              />
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
      </Root>
    );
  }
}

const mapStateToProps = ({userData}) => ({
  userData,
});

export default connect(mapStateToProps)(PropertyInsurance);
