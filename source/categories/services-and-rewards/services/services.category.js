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
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
  lookupType,
} from '../../../configuration/api/api.functions';
import {
  serviceType,
  payment_due_type,
  is_credit_card_provided,
} from './services.list';
import {formatDate} from '../../../configuration/card-formatter/card-formatter';
import {Color} from '../../../assets/color/color.js';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';

import styles from './services.style';

class ServiceAccount extends Component {
  initialState = {
    isLoader: false,
    modal: false,
    refBusModal: false,
    array: [],
    key: '',
    access_token: '',
    name: '',
    accNo: '',
    primaryAcHolder: '',
    provider: '',
    providerId: '',
    username: '',
    password: '',
    installment: '',
    from: '',
    to: '',
    total: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    securityQ1: '',
    securityA1: '',
    securityQ2: '',
    securityA2: '',
    securityQ3: '',
    securityA3: '',
    additionalAcHolder1: '',
    additionalAcHolder2: '',
    paymentDueType: '',
    isCreditCardProvided: '',
    creditCardProvided: '',
    serviceType: '',
    notes: '',
    creditCardArray: [],
    editable: true,
    refArray: [],
    showQuestion: false,
    changes: false,
    shareKeyId: '',
    providerClicked: false,
  };
  constructor(props) {
    super(props);

    this.state = {
      ...this.initialState,
     
    };
    // this.handleBackPress = this.handleBackPress.bind(this);
  }
  userInfo = null;
  componentDidMount() {
    const {navigation, route} = this.props;
    BackHandler.addEventListener('hardwareBackPress', this.onBack);

    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      // if (this.props.userData && this.props.userData.userData)
      // if(this.userInfo)
        this.setState(
          {
            // access_token: this.props.userData.userData.access_token,
            access_token:this.userInfo?.access_token
          },
          () => this.viewRecord(),
          this.getBusinessEntity(),
          this.getCreditCard(),
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
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  refreshData = () => {
    this.viewRecord();
  };
  viewRecord = async () => {
    console.log("click here")
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
   
    this.setState({isLoader: true});
    await viewRecords(
      'ServiceAccount',
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

  setViewData = (data) => {
    console.log('Data: ', data);
    this.setState(
      {
        name: data.ServiceName,
        accNo: data.AccountNumber,
        primaryAcHolder: data.PrimaryAccountHolder,
        provider: data.Provider.label,
        providerId: data.Provider.id,
        username: data.WebsiteUserName,
        password: data.WebsitePassword,
        installment: data.PaymentSchedule.InstallmentAmount,
        from: data.PaymentSchedule.InstallmentStartDate,
        to: data.PaymentSchedule.InstallmentEndDate,
        total: data.PaymentSchedule.TotalAmount,
        paymentDueType: data.PaymentSchedule.PaymentDueDay,
        address1: data.MailingAddress.Line1,
        address2: data.MailingAddress.Line2,
        city: data.MailingAddress.City,
        state: data.MailingAddress.State,
        zip: data.MailingAddress.Zip,
        country: data.MailingAddress.Country,
        securityQ1: data.SecurityQuestion1,
        securityA1: data.SecurityAnswer1,
        securityQ2: data.SecurityQuestion2,
        securityA2: data.SecurityAnswer2,
        securityQ3: data.SecurityQuestion3,
        securityA3: data.SecurityAnswer3,
        additionalAcHolder1: data.AdditionalAccountHolder1,
        additionalAcHolder2: data.AdditionalAccountHolder2,
        serviceType: data.ServiceType,
        notes: data.Comment,
        isCreditCardProvided: data.IsCreditCardProvided ? 'Yes' : 'No',
        creditCardProvided:
          data.CreditCardProvided.label === undefined
            ? ''
            : data.CreditCardProvided.label,
        shareKeyId: data.shareKeyId,
        isLoader: false,
      },
      () => this.referenceObj(),
    );
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

  referenceObj = () => {
    const {refArray} = this.state;
    refArray
      .filter((item) => item.id === this.state.issuingBankId)
      .map((val) => this.setState({provider: val.label}));
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
      await lookupType(this.userInfo?.access_token, 'RefBusinessEntity')
        .then((response) => {
          response.pop();
          this.setState({refArray: response});
        })
        .catch((error) => console.log('Ref Business error: ', error));
    // }
  };

  getCreditCard = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    // const {userData} = this.props;
    // if (userData !== null) {
      await lookupType(this.userInfo?.access_token, 'CreditCard')
        .then((response) => {
          console.log('Response credit card: ', response);
          this.setState({creditCardArray: response});
        })
        .catch((error) => console.log('Ref Credit card error: ', error));
    // }
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
      accNo,
      primaryAcHolder,
      providerId,
      username,
      password,
      installment,
      from,
      to,
      total,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      securityQ1,
      securityA1,
      securityQ2,
      securityA2,
      securityQ3,
      securityA3,
      additionalAcHolder1,
      additionalAcHolder2,
      access_token,
      serviceType,
      paymentDueType,
      isCreditCardProvided,
      creditCardProvided,
      notes,
    } = this.state;
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      ServiceName: name,
      AccountNumber: accNo,
      PrimaryAccountHolder: primaryAcHolder,
      Provider: providerId,
      WebsiteUserName: username,
      WebsitePassword: password,
      'PaymentSchedule-InstallmentAmount': installment,
      'PaymentSchedule-InstallmentStartDate': from,
      'PaymentSchedule-InstallmentEndDate': to,
      'PaymentSchedule-TotalAmount': total,
      'PaymentSchedule-PaymentDueDay': paymentDueType,
      'MailingAddress-Line1': address1,
      'MailingAddress-Line2': address2,
      'MailingAddress-City': city,
      'MailingAddress-State': state,
      'MailingAddress-Zip': zip,
      'MailingAddress-Country': country,
      SecurityQuestion1: securityQ1,
      SecurityAnswer1: securityA1,
      SecurityQuestion2: securityQ2,
      SecurityAnswer2: securityA2,
      SecurityQuestion3: securityQ3,
      SecurityAnswer3: securityA3,
      AdditionalAccountHolder1: additionalAcHolder1,
      AdditionalAccountHolder2: additionalAcHolder2,
      ServiceType: serviceType,
      IsCreditCardProvided: isCreditCardProvided,
      Comment: notes,
      CreditCardProvided: this.getSelectedCreditId(creditCardProvided),
    });

    await createOrUpdateRecord('ServiceAccount', recid, data, this.userInfo?.access_token)
      .then((response) => {
        this.setState({isLoader: false});
        navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoader: false});
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Login'}],
        // });
        console.log("eroor",error)
      });
  };

  getSelectedCreditId = (creditCardProvided) => {
    let {creditCardArray} = this.state;
    let creditRef = '';
    creditCardArray
      .filter((item) => item.label === creditCardProvided)
      .map((val) => {
        creditRef = val.id;
      });
    return creditRef;
  };

  delete = async () => {
    const {navigation, route} = this.props;
    const {recid} = route.params;
    await deleteRecords(
      'ServiceAccount',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo?.access_token
    )
    console.log("recid",recid)
      .then((response) => navigation.goBack())
      .catch((error) => {
        console.log('Error in delete', error);
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Login'}],
        // });
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
      'ServiceAccount',
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

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
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
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Account Number"
          onChangeText={(accNo) =>
            this.setState({accNo}, () => this.changesMade())
          }
          keyboardType="number-pad"
          color={Color.veryLightBlue}
          value={this.state.accNo}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.accNo}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Primary Account Holder"
          onChangeText={(primaryAcHolder) =>
            this.setState({primaryAcHolder}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
          value={this.state.primaryAcHolder}
          editable={this.state.editable}
        />
      </View>
      <View style={[styles.inputContainer, {zIndex: 1000}]}>
        <AutoCompleteText
          placeholder="Provider"
          onChangeText={(provider) =>
            this.setState(
              {provider, providerClicked: !provider ? true : false},
              () => this.changesMade(),
            )
          }
          keyboardType="default"
          value={this.state.provider}
          color={Color.veryLightBlue}
          editable={this.state.editable}
          array={this.state.refArray}
          onPress={(provider) => this.showAutoComplete(provider)}
          clicked={this.state.providerClicked}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.serviceType.length === 0
              ? 'Type'
              : this.state.serviceType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: serviceType,
                key: 'serviceType',
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
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Installment"
          onChangeText={(installment) =>
            this.setState({installment}, () => this.changesMade())
          }
          icon="dollar-sign"
          keyboardType="number-pad"
          color={Color.veryLightBlue}
          value={this.state.installment}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
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
          color={Color.veryLightBlue}
          // editable={this.state.editable}
          editable={false}
          name="Due"
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="From"
            onChangeText={(from) =>
              this.setState({from: formatDate(from)}, () => this.changesMade())
            }
            keyboardType="number-pad"
            color={Color.veryLightBlue}
            value={this.state.from}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="To"
            onChangeText={(to) =>
              this.setState({to: formatDate(to)}, () => this.changesMade())
            }
            keyboardType="number-pad"
            color={Color.veryLightBlue}
            value={this.state.to}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextIconDynamic
          placeholder="Total"
          onChangeText={(total) =>
            this.setState({total}, () => this.changesMade())
          }
          icon="dollar-sign"
          keyboardType="number-pad"
          color={Color.veryLightBlue}
          value={this.state.total}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  paymentMailingAddress = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 1"
          onChangeText={(address1) =>
            this.setState({address1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.veryLightBlue}
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
          color={Color.veryLightBlue}
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
          color={Color.veryLightBlue}
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
          color={Color.veryLightBlue}
          value={this.state.state}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Zip/Postal"
          onChangeText={(zip) => this.setState({zip}, () => this.changesMade())}
          keyboardType="number-pad"
          color={Color.veryLightBlue}
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
          color={Color.veryLightBlue}
          editable={this.state.editable}
          name="Country"
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
          color={Color.veryLightBlue}
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
          color={Color.veryLightBlue}
          value={this.state.securityA3}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  additionalInformation = () => {
    return (
      <View>
        <View style={styles.inputContainer}>
          <InputTextDynamic
            placeholder="Additional Account Holder 1"
            onChangeText={(additionalAcHolder1) =>
              this.setState({additionalAcHolder1}, () => this.changesMade())
            }
            keyboardType="default"
            color={Color.veryLightBlue}
            value={this.state.additionalAcHolder1}
            editable={this.state.editable}
          />
        </View>
        <View style={styles.inputContainer}>
          <InputTextDynamic
            placeholder="Additional Account Holder 2"
            onChangeText={(additionalAcHolder2) =>
              this.setState({additionalAcHolder2}, () => this.changesMade())
            }
            keyboardType="default"
            color={Color.veryLightBlue}
            value={this.state.additionalAcHolder2}
            editable={this.state.editable}
          />
        </View>
        <View style={styles.inputContainer}>
          <ModalPicker
            label={
              this.state.isCreditCardProvided.length === 0
                ? 'Is Credit Card Provided?'
                : this.state.isCreditCardProvided
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: is_credit_card_provided,
                  key: 'isCreditCardProvided',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            // editable={this.state.editable}
            editable={false}
            name="Is Credit Card Provided?"
          />
        </View>
        <View style={styles.inputContainer}>
          <ModalPicker
            label={
              this.state.creditCardProvided.length === 0
                ? 'Credit Card On Record'
                : this.state.creditCardProvided
            }
            onPress={() => this.filterCardArray()}
            color={Color.veryLightBlue}
            // editable={this.state.editable}
            editable={false}
            name="Credit Card On Record"
          />
        </View>
      </View>
    );
  };

  filterCardArray = () => {
    const {creditCardArray} = this.state;
    let arr = [];
    creditCardArray.map((label) => {
      arr.push(label.label);
    });
    this.setState(
      {
        modal: true,
        array: arr,
        key: 'creditCardProvided',
      },
      () => this.changesMade(),
    );
  };

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

  changeModalVisibility = (bool) => {
    this.setState({modal: bool});
  };

  changeState = (key, value) => {
    this.setState({[key]: value});
  };

  changeRefBusinessmModal = (bool) => {
    this.setState({refBusModal: bool});
  };

  refreshingList = () => {
    this.getBusinessEntity();
  };

  showAutoComplete = (provider) => {
    if (provider.label === 'Add')
      this.setState({refBusModal: true, providerClicked: true});
    else {
      this.setState(
        {
          provider: provider.label,
          providerId: provider.id,
        },
        () => this.setState({hideResult: true, providerClicked: true}),
      );
    }
  };

  editComponent = (isLoader, modal, array, key, editable, refBusModal) => (
    <View>
      <Text style={styles.title}>Basic Information</Text>
      {this.basicInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>Payment Mailing Address</Text>
      {this.paymentMailingAddress()}
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
        access_token={this.userInfo?.access_token}
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
    console.log('Array: ', this.state.creditCardArray);
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
                type={'ServiceAccount'}
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

const mapStateToProps = ({userData, country}) => ({
  userData,
  country,
});

export default connect(mapStateToProps)(ServiceAccount);
