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
import Loader from '../../../components/loader/loader.component';
import ModalScreen from '../../../components/modal/modal.component';
import AutoCompleteText from '../../../components/auto-complete-text-input/auto-complete-text-input.component';
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
} from '../../../configuration/api/api.functions';
import {insurance_type, plan_type, payment_due_type} from './health-care.list';
import {formatDate} from '../../../configuration/card-formatter/card-formatter';
import {Color} from '../../../assets/color/color.js';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';
import ExternalLink from '../../../components/external-link/external-link.component';

import styles from './health-care.style';

class HealthCareProvider extends Component {
  initialState = {
    isLoader: false,
    editable: true,
    access_token: '',
    modal: '',
    array: [],
    key: '',
    insuranceProvider: '',
    insuranceType: '',
    planType: '',
    groupIdNumber: '',
    planCoverage: '',
    deductible: '',
    url: '',
    username: '',
    password: '',
    customerServiceNo: '',
    emailProvided: '',
    effectiveFrom: '',
    expiration: '',
    installment: '',
    from: '',
    to: '',
    total: '',
    paymentDueType: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    dependent1: '',
    dependent2: '',
    dependent3: '',
    dependent4: '',
    changes: false,
    shareKeyId: '',
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
        );
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', handler);
  }

  viewRecord = async () => {
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
    this.setState({isLoader: true});
    await viewRecords(
      'HealthCareProvider',
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
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
    this.setState({isLoader: false});
    if (mode === 'Add') this.setState({editable: false, hideResult: false});
  };

  refreshData = () => {
    this.viewRecord()
  }

  setViewData = (data) => {
    console.log('Data: ', data);
    this.setState({
      insuranceProvider: data.ProviderName,
      groupIdNumber: data.GroupID,
      planCoverage: data.PlanCoverage,
      deductible: data.Deductible,
      url: data.URL,
      insuranceType: data.ProviderType,
      planType: data.PlanType,
      username: data.WebsiteUserName,
      password: data.WebsitePassword,
      customerServiceNo: data.Phone,
      emailProvided: data.EmailAddress,
      effectiveFrom: data.ServiceEffectiveDate,
      expiration: data.ServiceTerminationDate,
      installment: data.PaymentSchedule.InstallmentAmount,
      from: data.PaymentSchedule.InstallmentStartDate,
      to: data.PaymentSchedule.InstallmentEndDate,
      total: data.PaymentSchedule.TotalAmount,
      paymentDueType: data.PaymentSchedule.PaymentDueType,
      address1: data.ClaimsMailingAddress.Line1,
      address2: data.ClaimsMailingAddress.Line2,
      city: data.ClaimsMailingAddress.City,
      state: data.ClaimsMailingAddress.State,
      zip: data.ClaimsMailingAddress.Zip,
      country: data.ClaimsMailingAddress.Country,
      dependent1: data.Dependent1,
      dependent2: data.Dependent2,
      dependent3: data.Dependent3,
      dependent4: data.Dependent4,
      notes: data.Note,
      shareKeyId: data.shareKeyId,
      isLoader: false,
    });
  };

  submit = async () => {
    this.setState({isLoader: true});
    const {
      access_token,
      insuranceProvider,
      insuranceType,
      planType,
      groupIdNumber,
      planCoverage,
      deductible,
      url,
      username,
      password,
      customerServiceNo,
      emailProvided,
      effectiveFrom,
      expiration,
      installment,
      from,
      to,
      total,
      paymentDueType,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      dependent1,
      dependent2,
      dependent3,
      dependent4,
      notes,
    } = this.state;

    const {navigation, route} = this.props;
    const {recid} = route.params;

    let data = qs.stringify({
      ProviderName: insuranceProvider,
      GroupID: groupIdNumber,
      PlanCoverage: planCoverage,
      Deductible: deductible,
      URL: url,
      ProviderType: insuranceType,
      PlanType: planType,
      WebsiteUserName: username,
      WebsitePassword: password,
      Phone: customerServiceNo,
      EmailAddress: emailProvided,
      ServiceEffectiveDate: effectiveFrom,
      ServiceTerminationDate: expiration,
      'PaymentSchedule-InstallmentAmount': installment,
      'PaymentSchedule-InstallmentStartDate': from,
      'PaymentSchedule-InstallmentEndDate': to,
      'PaymentSchedule-TotalAmount': total,
      'PaymentSchedule-PaymentDueType': paymentDueType,
      'ClaimsMailingAddress-Line1': address1,
      'ClaimsMailingAddress-Line2': address2,
      'ClaimsMailingAddress-City': city,
      'ClaimsMailingAddress-State': state,
      'ClaimsMailingAddress-Zip': zip,
      'ClaimsMailingAddress-Country': country,
      Dependent1: dependent1,
      Dependent2: dependent2,
      Dependent3: dependent3,
      Dependent4: dependent4,
      Note: notes,
    });

    await createOrUpdateRecord('HealthCareProvider', recid, data, access_token)
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
      'HealthCareProvider',
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
      'HealthCareProvider',
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

  baiscInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Insurance Provider"
          onChangeText={(insuranceProvider) =>
            this.setState({insuranceProvider}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.insuranceProvider}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.insuranceType.length === 0
              ? 'Insurance Type'
              : this.state.insuranceType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: insurance_type,
                key: 'insuranceType',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightPink}
          editable={this.state.editable}
          name="Insurance Type"
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.planType.length === 0 ? 'Plan Type' : this.state.planType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: plan_type,
                key: 'planType',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightPink}
          editable={this.state.editable}
          name="Plan Type"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Group ID Number"
          onChangeText={(groupIdNumber) =>
            this.setState({groupIdNumber}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.groupIdNumber}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Plan Coverage"
          onChangeText={(planCoverage) =>
            this.setState({planCoverage}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.planCoverage}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Deductible"
          onChangeText={(deductible) =>
            this.setState({deductible}, () => this.changesMade())
          }
          keyboardType="default"
          value={this.state.deductible}
          color={Color.veryLightPink}
          editable={this.state.editable}
        />
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

  additionalInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Customer Service Number"
          onChangeText={(customerServiceNo) =>
            this.setState({customerServiceNo}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.customerServiceNo}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Email Provided"
          onChangeText={(emailProvided) =>
            this.setState({emailProvided}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.emailProvided}
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
          <InputTextDynamic
            placeholder="Expiration"
            onChangeText={(expiration) =>
              this.setState({expiration: formatDate(expiration)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="default"
            color={Color.veryLightPink}
            value={this.state.expiration}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Installment"
          onChangeText={(installment) =>
            this.setState({installment}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.installment}
          editable={this.state.editable}
        />
      </View>
      <View style={[styles.inputContainer, {marginRight: 10}]}>
        <ModalPicker
          label={
            this.state.paymentDueType.length === 0
              ? 'Due'
              : this.state.paymentDueType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: payment_due_type,
                key: 'paymentDueType',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightPink}
          editable={this.state.editable}
          name="Due"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="From"
          onChangeText={(from) =>
            this.setState({from: formatDate(from)}, () => this.changesMade())
          }
          color={Color.veryLightPink}
          value={this.state.from}
          editable={this.state.editable}
          example="DD/MM/YYYY"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="To"
          onChangeText={(to) =>
            this.setState({to: formatDate(to)}, () => this.changesMade())
          }
          color={Color.veryLightPink}
          value={this.state.to}
          editable={this.state.editable}
          example="DD/MM/YYYY"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Total"
          onChangeText={(total) =>
            this.setState({total}, () => this.changesMade())
          }
          color={Color.veryLightPink}
          value={this.state.total}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  claimMailingAddress = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 1"
          onChangeText={(address1) =>
            this.setState({address1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.address1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 2"
          onChangeText={(address2) =>
            this.setState({address2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.address2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="City"
          onChangeText={(city) =>
            this.setState({city}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.city}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="State"
          onChangeText={(state) =>
            this.setState({state}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.state}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Zip/Postal"
          onChangeText={(zip) => this.setState({zip}, () => this.changesMade())}
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.zip}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.country.length === 0 ? 'Country' : this.state.country
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: this.props.country.country,
                key: 'country',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightPink}
          editable={this.state.editable}
          name="Country"
        />
      </View>
    </View>
  );

  dependentInfo = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Dependent 1"
          onChangeText={(dependent1) =>
            this.setState({dependent1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.dependent1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Dependent 2"
          onChangeText={(dependent2) =>
            this.setState({dependent2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.dependent2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Dependent 3"
          onChangeText={(dependent3) =>
            this.setState({dependent3}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.dependent3}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Dependent 4"
          onChangeText={(dependent4) =>
            this.setState({dependent4}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightPink}
          value={this.state.dependent4}
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

  changeState = (key, value) => {
    this.setState({[key]: value});
  };

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
  };

  editComponent = (isLoader, modal, array, key, editable) => (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Information</Text>
      {this.baiscInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>Additional Information</Text>
      {this.additionalInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>Claims Mailing Address</Text>
      {this.claimMailingAddress()}
      <View style={styles.gap} />
      <Text style={styles.title}>Dependent Information</Text>
      {this.dependentInfo()}
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
    const {title, type, mode, recid} = route.params;
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
              <SwitchKey type={'HealthCareProvider'} recid={recid} shareKeyId={shareKeyId} refresh={this.refreshData}/>
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
      </Root>
    );
  }
}

const mapStateToProps = ({userData, country}) => ({
  userData,
  country,
});

export default connect(mapStateToProps)(HealthCareProvider);
