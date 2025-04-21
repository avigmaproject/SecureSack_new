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
import {Root,NativeBaseProvider} from 'native-base';
import {useSelector} from 'react-redux';
import InputTextDynamic from '../../../components/input-text-dynamic/input-text-dynamic.component';
import InputTextIconDynamic from '../../../components/input-text-icon-dynamic/input-text-icon-dynamic.component';
import ModalPicker from '../../../components/modal-picker/modal-picker.component';
import Loader from '../../../components/loader/loader.component';
import ModalScreen from '../../../components/modal/modal.component';
import RefBusinessModal from '../../../components/ref-business-modal/ref-business-modal.component';
import TitleView from '../../../components/title-view/title-view.component';
import AutoCompleteText from '../../../components/auto-complete-text-input/auto-complete-text-input.component';
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
  lookupType,
} from '../../../configuration/api/api.functions';
import {account_type, size, payment_due_type} from './bank-account.list';
import {Color} from '../../../assets/color/color';
import {
  formatCardNumber,
  formatExpiry,
  formatDate,
} from '../../../configuration/card-formatter/card-formatter';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';

import styles from './bank-account.style';

class BankAccounts extends Component {
  initialState = {
    isLoader: false,
    modal: false,
    refBusModal: false,
    array: [],
    key: '',
    title: '',
    dataType: '',
    name: '',
    issuingBank: '',
    issuingBankId: '',
    accountNumber: '',
    bankRoutingNumber: '',
    userName: '',
    password: '',
    atm1CardNo: '',
    atm1CardPin: '',
    atm1CardExDate: '',
    atm1CVV: '',
    atm2CardNo: '',
    atm2CardPin: '',
    atm2CardExDate: '',
    atm2CVV: '',
    debit1CardNo: '',
    debit1CardPin: '',
    debit1CardExDate: '',
    debit1CVV: '',
    debit2CardNo: '',
    debit2CardPin: '',
    debit2CardExDate: '',
    debit2CVV: '',
    securityQ1: '',
    securityA1: '',
    securityQ2: '',
    securityA2: '',
    securityQ3: '',
    securityA3: '',
    boxNumber1: '',
    openedOn1: '',
    interestRate1: '',
    boxNumber2: '',
    openedOn2: '',
    interestRate2: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    accountType: '',
    size1: '',
    size2: '',
    paymentDueType1: '',
    paymentDueType2: '',
    save: '',
    access_token: '',
    notes: '',
    showQuestion: false,
    editable: true,
    hideResult: true,
    refArray: [],
    changes: false,
    shareKeyId: '',
    issuingBankClicked: false,
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

  
    this.getUserInfo(); // ✅ Call the async method here
  
    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      if (this.props.userData && this.props.userData.userData)
        this.setState(
          {
            // access_token: this.props.userData.userData.access_token,
          },
          () => this.viewRecord(),
          this.getBusinessEntity(),
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
      'BankAccounts',
      recid,
      this.props.userData.userData.access_token,
    )
      .then((response) => {
        console.log('View res: ', JSON.stringify(response));
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
    this.setState({isLoader: false});
    if (mode === 'Add') this.setState({editable: false, hideResult: false});
  };

  refreshData = () => {
    this.viewRecord();
  };

  setViewData = (data) => {
    this.setState(
      {
        name: data.AccountName,
        issuingBank: data.FinancialInstitution.label,
        issuingBankId: data.FinancialInstitution.id,
        accountNumber: data.AccountNumber,
        bankRoutingNumber: data.RoutingNumber,
        userName: data.WebSiteUsername,
        password: data.WebSitePassword,
        atm1CardNo: data.ATMCardNumber,
        atm1CardPin: data.ATMCardPIN,
        atm1CardExDate: data.ATMCardExpirationDate,
        atm1CVV: data.ATMCardCCVNumber,
        atm2CardNo: data.ATMCardNumber2,
        atm2CardPin: data.ATMCardPIN2,
        atm2CardExDate: data.ATMCardExpirationDate2,
        atm2CVV: data.ATMCardCCVNumber2,
        debit1CardNo: data.DebitCardNumber,
        debit1CardPin: data.DebitCardPIN,
        debit1CardExDate: data.DebitCardExpirationDate,
        debit1CVV: data.DebitCardCCVNumber,
        debit2CardNo: data.DebitCardNumber2,
        debit2CardPin: data.DebitCardPIN2,
        debit2CardExDate: data.DebitCardExpirationDate2,
        debit2CVV: data.DebitCardCCVNumber2,
        securityQ1: data.SecurityQuestion1,
        securityA1: data.SecurityAnswer1,
        securityQ2: data.SecurityQuestion2,
        securityA2: data.SecurityAnswer2,
        securityQ3: data.SecurityQuestion3,
        securityA3: data.SecurityAnswer3,
        boxNumber1: data.SafetyDepositBox1.BoxNumber,
        openedOn1: data.SafetyDepositBox1.BoxOpeningDate,
        interestRate1: data.SafetyDepositBox1.Fee,
        size1: data.SafetyDepositBox1.BoxSize,
        paymentDueType1: data.SafetyDepositBox1.FeeDuration,
        boxNumber2: data.SafetyDepositBox2.BoxNumber,
        openedOn2: data.SafetyDepositBox2.BoxOpeningDate,
        interestRate2: data.SafetyDepositBox2.Fee,
        size2: data.SafetyDepositBox2.BoxSize,
        paymentDueType2: data.SafetyDepositBox2.FeeDuration,
        address1: data.BankBranchAddress.Line1,
        address2: data.BankBranchAddress.Line2,
        city: data.BankBranchAddress.City,
        state: data.BankBranchAddress.State,
        zip: data.BankBranchAddress.Zip,
        country: data.BankBranchAddress.Country,
        accountType: data.AccountType,
        notes: data.Comment,
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
      .map((val) => this.setState({issuingBank: val.label}));
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

  basicInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Name"
          onChangeText={(name) =>
            this.setState({name}, () => this.changesMade())
          }
          keyboardType="default"
          value={this.state.name}
          color={Color.lightishBlue}
          editable={this.state.editable}
        />
      </View>
      <View style={[styles.inputContainer, {zIndex: 1000}]}>
        <AutoCompleteText
          placeholder="Issuing Bank"
          onChangeText={(issuingBank) =>
            this.setState(
              {issuingBank, issuingBankClicked: !issuingBank ? true : false},
              () => this.changesMade(),
            )
          }
          keyboardType="default"
          value={this.state.issuingBank}
          color={Color.lightishBlue}
          editable={this.state.editable}
          array={this.state.refArray}
          onPress={(issuingBank) => this.showAutoComplete(issuingBank)}
          clicked={this.state.issuingBankClicked}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.accountType.length === 0
              ? 'Account Type'
              : this.state.accountType
          }
          onPress={() =>
            this.setState({
              modal: true,
              array: account_type,
              key: 'accountType',
            })
          }
          color={Color.lightishBlue}
          editable={this.state.editable}
          name="Account Type"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Account Number"
          onChangeText={(accountNumber) =>
            this.setState({accountNumber}, () => this.changesMade())
          }
          keyboardType="number-pad"
          value={this.state.accountNumber}
          color={Color.lightishBlue}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.accountNumber}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Bank Routing Number"
          onChangeText={(bankRoutingNumber) =>
            this.setState({bankRoutingNumber}, () => this.changesMade())
          }
          keyboardType="number-pad"
          value={this.state.bankRoutingNumber}
          color={Color.lightishBlue}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.bankRoutingNumber}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="User Name"
          onChangeText={(userName) =>
            this.setState({userName}, () => this.changesMade())
          }
          keyboardType="default"
          value={this.state.userName}
          color={Color.lightishBlue}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.userName}
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
          value={this.state.password}
          color={Color.lightishBlue}
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

  atmCard = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="ATM Card Number"
          onChangeText={(atm1CardNo) =>
            this.setState({atm1CardNo: formatCardNumber(atm1CardNo)}, () =>
              this.changesMade(),
            )
          }
          keyboardType="number-pad"
          value={this.state.atm1CardNo}
          color={Color.lightishBlue}
          editable={this.state.editable}
          example="XXXX XXXX XXXX XXXX"
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.atm1CardNo}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="ATM Card PIN"
          onChangeText={(atm1CardPin) =>
            this.setState({atm1CardPin}, () => this.changesMade())
          }
          keyboardType="number-pad"
          value={this.state.atm1CardPin}
          color={Color.lightishBlue}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Expiration Date"
            onChangeText={(atm1CardExDate) =>
              this.setState(
                {atm1CardExDate: formatExpiry(atm1CardExDate)},
                () => this.changesMade(),
              )
            }
            keyboardType="number-pad"
            value={this.state.atm1CardExDate}
            color={Color.lightishBlue}
            editable={this.state.editable}
            example="MM/YY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="CVV"
            onChangeText={(atm1CVV) =>
              this.setState({atm1CVV}, () => this.changesMade())
            }
            keyboardType="number-pad"
            value={this.state.atm1CVV}
            color={Color.lightishBlue}
            editable={this.state.editable}
          />
        </View>
      </View>
    </View>
  );

  debitCard = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Debit Card Number"
          onChangeText={(debit1CardNo) =>
            this.setState({debit1CardNo: formatCardNumber(debit1CardNo)}, () =>
              this.changesMade(),
            )
          }
          keyboardType="number-pad"
          value={this.state.debit1CardNo}
          color={Color.lightishBlue}
          editable={this.state.editable}
          example="XXXX XXXX XXXX XXXX"
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.debit1CardNo}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Debit Card PIN"
          onChangeText={(debit1CardPin) =>
            this.setState({debit1CardPin}, () => this.changesMade())
          }
          keyboardType="number-pad"
          value={this.state.debit1CardPin}
          color={Color.lightishBlue}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Expiration Date"
            onChangeText={(debit1CardExDate) =>
              this.setState(
                {debit1CardExDate: formatExpiry(debit1CardExDate)},
                () => this.changesMade(),
              )
            }
            keyboardType="number-pad"
            value={this.state.debit1CardExDate}
            color={Color.lightishBlue}
            editable={this.state.editable}
            example="MM/YY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="CVV"
            onChangeText={(debit1CVV) =>
              this.setState({debit1CVV}, () => this.changesMade())
            }
            keyboardType="number-pad"
            value={this.state.debit1CVV}
            color={Color.lightishBlue}
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
          value={this.state.securityQ1}
          color={Color.lightishBlue}
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
          value={this.state.securityA1}
          color={Color.lightishBlue}
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
          value={this.state.securityQ2}
          color={Color.lightishBlue}
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
          value={this.state.securityA2}
          color={Color.lightishBlue}
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
          value={this.state.securityQ3}
          color={Color.lightishBlue}
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
          value={this.state.securityA3}
          color={Color.lightishBlue}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  safetyDepositBox = () => (
    <View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Box Number"
            onChangeText={(boxNumber1) =>
              this.setState({boxNumber1}, () => this.changesMade())
            }
            keyboardType="number-pad"
            value={this.state.boxNumber1}
            color={Color.lightishBlue}
            editable={this.state.editable}
          />
        </View>
        <View style={styles.miniInputContainer}>
          <ModalPicker
            label={this.state.size1.length === 0 ? 'Size' : this.state.size1}
            onPress={() =>
              this.setState({modal: true, array: size, key: 'size1'}, () =>
                this.changesMade(),
              )
            }
            color={Color.lightishBlue}
            editable={this.state.editable}
            name="Size"
          />
        </View>
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Opened on"
            onChangeText={(openedOn1) =>
              this.setState({openedOn1: formatDate(openedOn1)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="number-pad"
            value={this.state.openedOn1}
            color={Color.lightishBlue}
            editable={this.state.editable}
            example="MM/DD/YYYY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextIconDynamic
            placeholder="Interest Rate"
            onChangeText={(interestRate1) =>
              this.setState({interestRate1}, () => this.changesMade())
            }
            icon="dollar-sign"
            keyboardType="number-pad"
            color={Color.lightishBlue}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.paymentDueType1.length === 0
              ? 'Payment Due Type'
              : this.state.paymentDueType1
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: payment_due_type,
                key: 'paymentDueType1',
              },
              () => this.changesMade(),
            )
          }
          color={Color.lightishBlue}
          editable={this.state.editable}
          name="Payment Due Type"
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Box Number"
            onChangeText={(boxNumber2) =>
              this.setState({boxNumber2}, () => this.changesMade())
            }
            keyboardType="number-pad"
            value={this.state.boxNumber2}
            color={Color.lightishBlue}
            editable={this.state.editable}
          />
        </View>
        <View style={styles.miniInputContainer}>
          <ModalPicker
            label={this.state.size2.length === 0 ? 'Size' : this.state.size2}
            onPress={() =>
              this.setState({modal: true, array: size, key: 'size2'}, () =>
                this.changesMade(),
              )
            }
            color={Color.lightishBlue}
            editable={this.state.editable}
            name="Size"
          />
        </View>
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Opened on"
            onChangeText={(openedOn2) =>
              this.setState({openedOn2: formatDate(openedOn2)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="number-pad"
            value={this.state.openedOn2}
            color={Color.lightishBlue}
            editable={this.state.editable}
            example="MM/DD/YYYY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextIconDynamic
            placeholder="Interest Rate"
            onChangeText={(interestRate2) =>
              this.setState({interestRate2}, () => this.changesMade())
            }
            icon="dollar-sign"
            keyboardType="number-pad"
            color={Color.lightishBlue}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.paymentDueType2.length === 0
              ? 'Payment Due Type'
              : this.state.paymentDueType2
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: payment_due_type,
                key: 'paymentDueType2',
              },
              () => this.changesMade(),
            )
          }
          color={Color.lightishBlue}
          editable={this.state.editable}
          name="Payment Due Type"
        />
      </View>
    </View>
  );

  additonalInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 1"
          onChangeText={(address1) =>
            this.setState({address1}, () => this.changesMade())
          }
          keyboardType="default"
          value={this.state.address1}
          color={Color.lightishBlue}
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
          value={this.state.address2}
          color={Color.lightishBlue}
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
          value={this.state.city}
          color={Color.lightishBlue}
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
          value={this.state.state}
          color={Color.lightishBlue}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Zip/Postal"
          onChangeText={(zip) => this.setState({zip}, () => this.changesMade())}
          keyboardType="number-pad"
          value={this.state.zip}
          color={Color.lightishBlue}
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
          color={Color.lightishBlue}
          editable={this.state.editable}
          name="Country"
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
            color={Color.lightishBlue}
            value={this.state.notes}
          />
        ) : (
          <Text style={styles.notes}>{this.state.notes}</Text>
        )}
      </View>
      <View style={styles.clipboard}>
        <CopyClipboard text={this.state.notes} editable={this.state.editable} />
      </View>
    </View>
  );

  submit = async () => {
    this.setState({isLoader: true});
    const {
      access_token,
      name,
      issuingBank,
      accountNumber,
      bankRoutingNumber,
      userName,
      password,
      atm1CardNo,
      atm1CardPin,
      atm1CardExDate,
      atm1CVV,
      atm2CardNo,
      atm2CardPin,
      atm2CardExDate,
      atm2CVV,
      debit1CardNo,
      debit1CardPin,
      debit1CardExDate,
      debit1CVV,
      debit2CardNo,
      debit2CardPin,
      debit2CardExDate,
      debit2CVV,
      securityQ1,
      securityA1,
      securityQ2,
      securityA2,
      securityQ3,
      securityA3,
      boxNumber1,
      openedOn1,
      interestRate1,
      boxNumber2,
      openedOn2,
      interestRate2,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      accountType,
      size1,
      size2,
      paymentDueType1,
      paymentDueType2,
      issuingBankId,
      notes,
    } = this.state;
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      AccountName: name,
      FinancialInstitution: issuingBank,
      AccountNumber: accountNumber,
      RoutingNumber: bankRoutingNumber,
      WebSiteUsername: userName,
      WebSitePassword: password,
      ATMCardNumber: atm1CardNo,
      ATMCardPIN: atm1CardPin,
      ATMCardExpirationDate: atm1CardExDate,
      ATMCardCCVNumber: atm1CVV,
      ATMCardNumber2: atm2CardNo,
      ATMCardPIN2: atm2CardPin,
      ATMCardExpirationDate2: atm2CardExDate,
      ATMCardCCVNumber2: atm2CVV,
      DebitCardNumber: debit1CardNo,
      DebitCardPIN: debit1CardPin,
      DebitCardExpirationDate: debit1CardExDate,
      DebitCardCCVNumber: debit1CVV,
      DebitCardNumber2: debit2CardNo,
      DebitCardPIN2: debit2CardPin,
      DebitCardExpirationDate2: debit2CardExDate,
      DebitCardCCVNumber2: debit2CVV,
      SecurityQuestion1: securityQ1,
      SecurityAnswer1: securityA1,
      SecurityQuestion2: securityQ2,
      SecurityAnswer2: securityA2,
      SecurityQuestion3: securityQ3,
      SecurityAnswer3: securityA3,
      'SafetyDepositBox1-BoxNumber': boxNumber1,
      'SafetyDepositBox1-BoxOpeningDate': openedOn1,
      'SafetyDepositBox1-Fee': interestRate1,
      'SafetyDepositBox1-BoxSize': size1,
      'SafetyDepositBox1-FeeDuration': paymentDueType1,
      'SafetyDepositBox2-BoxNumber': boxNumber2,
      'SafetyDepositBox2-BoxOpeningDate': openedOn2,
      'SafetyDepositBox2-Fee': interestRate2,
      'SafetyDepositBox2-BoxSize': size2,
      'SafetyDepositBox2-FeeDuration': paymentDueType2,
      'BankBranchAddress-Line1': address1,
      'BankBranchAddress-Line2': address2,
      'BankBranchAddress-City': city,
      'BankBranchAddress-State': state,
      'BankBranchAddress-Zip': zip,
      'BankBranchAddress-Country': country,
      AccountType: accountType,
      FinancialInstitution: issuingBankId,
      Comment: notes,
    });
    await createOrUpdateRecord('BankAccounts', recid, data, access_token)
      .then((response) => {
        this.setState({isLoader: false});
        navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoader: false});
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      });
  };

  delete = async () => {
    const {navigation, route} = this.props;
    const {recid} = route.params;
    await deleteRecords(
      'BankAccounts',
      recid,
      this.props.userData.userData.access_token,
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
      'BankAccounts',
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
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
  };

  changeModalVisibility = (bool) => {
    this.setState({modal: bool});
  };

  changeRefBusinessmModal = (bool) => {
    this.setState({refBusModal: bool});
  };

  refreshingList = () => {
    this.getBusinessEntity();
  };

  changeState = (key, value) => {
    this.setState({[key]: value});
  };

  showAutoComplete = (issuingBank) => {
    if (issuingBank.label === 'Add')
      this.setState({refBusModal: true, issuingBankClicked: true});
    else {
      this.setState(
        {
          issuingBank: issuingBank.label,
          issuingBankId: issuingBank.id,
        },
        () => this.setState({hideResult: true, issuingBankClicked: true}),
      );
    }
  };

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
  };

  editComponent = (isLoader, modal, array, key, editable, refBusModal) => (
    <View>
      <Text style={styles.title}>Basic Information</Text>
      {this.basicInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>ATM Card</Text>
      {this.atmCard()}
      <View style={styles.gap} />
      <Text style={styles.title}>Debit Card</Text>
      {this.debitCard()}
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
      <Text style={styles.title}>Safety Deposit Box</Text>
      {this.safetyDepositBox()}
      <View style={styles.gap} />
      <Text style={styles.title}>Additional Information</Text>
      {this.additonalInformation()}
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
        isModalVisible={refBusModal}
        changeModalVisibility={this.changeRefBusinessmModal}
        access_token={this.userInfo?.access_token }
        refreshingList={this.refreshingList}
      />
    </View>
  );

  onSave = () => {
    this.submit();
  };

  onEdit = () => {
    this.setState({editable: false, showQuestion: false}, () =>
      console.log(this.state.editable),
    );
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
      console.log('See: ');
    }
    return true;
  };

  background = () =>
    require('../../../assets/jpg-images/Financial-Data-Background/financial-data-background.jpg');

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
    console.log('Share Id: ', shareKeyId);
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
                title={title}
                theme={'light'}
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
                type={'BankAccounts'}
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

export default connect(mapStateToProps)(BankAccounts);
