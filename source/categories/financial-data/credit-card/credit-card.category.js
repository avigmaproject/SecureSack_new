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
import {NativeBaseProvider} from 'native-base';

import InputTextDynamic from '../../../components/input-text-dynamic/input-text-dynamic.component';
import InputTextIconDynamic from '../../../components/input-text-icon-dynamic/input-text-icon-dynamic.component';
import ModalPicker from '../../../components/modal-picker/modal-picker.component';
import Button from '../../../components/button/button.component';
import Loader from '../../../components/loader/loader.component';
import RefBusinessModal from '../../../components/ref-business-modal/ref-business-modal.component';
import ModalScreen from '../../../components/modal/modal.component';
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
import {credit_card_type} from './credit-card.list';
import {Color} from '../../../assets/color/color.js';
import {
  formatCardNumber,
  formatExpiry,
} from '../../../configuration/card-formatter/card-formatter';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';
import ExternalLink from '../../../components/external-link/external-link.component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './credit-card.style';

class CreditCard extends Component {
  initialState = {
    isLoader: false,
    modal: false,
    refBusModal: false,
    array: [],
    key: '',
    name: '',
    cardHolderName: '',
    cardNo: '',
    expiryDate: '',
    cvv: '',
    url: '',
    username: '',
    password: '',
    cardHolderName2: '',
    cardNo2: '',
    expiryDate2: '',
    cvv2: '',
    securityQ1: '',
    securityA1: '',
    securityQ2: '',
    securityA2: '',
    securityQ3: '',
    securityA3: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    notes: '',
    creditCardType: '',
    access_token: '',
    editable: true,
    issuer: '',
    issuerId: '',
    showQuestion: false,
    hideResult: true,
    refArray: [],
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
  userInfo = null;
  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      if (this.state.editable)
        BackHandler.addEventListener('hardwareBackPress', () => this.onBack());
      if (this.props.userData && this.props.userData.userData)
        this.setState(
          {access_token: this.userInfo?.access_token},
          () => this.viewRecord(),
          this.getBusinessEntity(),
          this.userInfo()
        );
    });
  }

  componentWillUnmount() {
    if (this.state.editable)
      BackHandler.removeEventListener('hardwareBackPress', this.backHandler);

  }

  viewRecord = async () => {
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
    this.setState({isLoader: true});
    await viewRecords(
      'CreditCard',
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
  setViewData = (data) => {
    this.setState(
      {
        name: data.Name,
        cardHolderName: data.PrimaryCardHolder,
        cardNo: data.CardNumber,
        expiryDate: data.ExpirationDate,
        cvv: data.CreditCardVerificationValue,
        issuer: data.Issuer.label,
        issuerId: data.Issuer.id,
        url: data.URL,
        username: data.WebSiteAccountNumber,
        password: data.WebSitePassword,
        cardHolderName2: data.AdditionalCardHolder,
        cardNo2: data.AdditionalCardNumber,
        expiryDate2: data.AdditionalCardExpirationDate,
        cvv2: data.AdditionalCreditCardVerificationValue,
        securityQ1: data.SecurityQuestion1,
        securityA1: data.SecurityAnswer1,
        securityQ2: data.SecurityQuestion2,
        securityA2: data.SecurityAnswer2,
        securityQ3: data.SecurityQuestion3,
        securityA3: data.SecurityAnswer3,
        address1: data.PaymentMailingAddress.Line1,
        address2: data.PaymentMailingAddress.Line2,
        city: data.PaymentMailingAddress.City,
        state: data.PaymentMailingAddress.State,
        zip: data.PaymentMailingAddress.Zip,
        country: data.PaymentMailingAddress.Country,
        creditCardType: data.CreditCardType,
        notes: data.Comment,
        isLoader: false,
        shareKeyId: data.shareKeyId,
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
      .filter((item) => item.id === this.state.issuerId)
      .map((val) => this.setState({issuer: val.label}));
  };

  submit = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    this.setState({isLoader: true});
    const {
      name,
      cardHolderName,
      cardNo,
      expiryDate,
      cvv,
      url,
      username,
      password,
      cardHolderName2,
      cardNo2,
      expiryDate2,
      cvv2,
      securityQ1,
      securityA1,
      securityQ2,
      securityA2,
      securityQ3,
      securityA3,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      access_token,
      creditCardType,
      issuerId,
      notes,
    } = this.state;
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      Name: name,
      PrimaryCardHolder: cardHolderName,
      CardNumber: cardNo,
      ExpirationDate: expiryDate,
      CreditCardVerificationValue: cvv,
      URL: url,
      WebSiteAccountNumber: username,
      WebSitePassword: password,
      AdditionalCardHolder: cardHolderName2,
      AdditionalCardNumber: cardNo2,
      AdditionalCardExpirationDate: expiryDate2,
      AdditionalCreditCardVerificationValue: cvv2,
      SecurityQuestion1: securityQ1,
      SecurityAnswer1: securityA1,
      SecurityQuestion2: securityQ2,
      SecurityAnswer2: securityA2,
      SecurityQuestion3: securityQ3,
      SecurityAnswer3: securityA3,
      'PaymentMailingAddress-Line1': address1,
      'PaymentMailingAddress-Line2': address2,
      'PaymentMailingAddress-City': city,
      'PaymentMailingAddress-State': state,
      'PaymentMailingAddress-Zip': zip,
      'PaymentMailingAddress-Country': country,
      CreditCardType: creditCardType,
      Issuer: issuerId,
      Comment: notes,
    });
    console.log('Check data: ', data);
    await createOrUpdateRecord('CreditCard', recid, data,  this.userInfo?.access_token,)
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
      'CreditCard',
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
      'CreditCard',
      recid,
      this.userInfo?.access_token,
      data,
    )
      .then((response) => {
        console.log('Response: ', response);
        this.setState({isLoader: false});
        navigation.goBack();
      })
      .catch((error) => {
        console.log('Error Response: ', error);
        this.setState({isLoader: false});
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
  };

  primaryCard = () => (
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
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Card Holder Name"
          onChangeText={(cardHolderName) =>
            this.setState({cardHolderName}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
          value={this.state.cardHolderName}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.creditCardType.length === 0
              ? 'Type'
              : this.state.creditCardType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: credit_card_type,
                key: 'creditCardType',
              },
              () => this.changesMade(),
            )
          }
          // editable={this.state.editable}
          editable={false}
          name="Type"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Card Number"
          onChangeText={(cardNo) =>
            this.setState({cardNo: formatCardNumber(cardNo)}, () =>
              this.changesMade(),
            )
          }
          keyboardType="number-pad"
          color={Color.lightishBlue}
          value={this.state.cardNo}
          editable={this.state.editable}
          example="XXXX XXXX XXXX XXXX"
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.cardNo}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Expiration Date"
            onChangeText={(expiryDate) =>
              this.setState({expiryDate: formatExpiry(expiryDate)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="number-pad"
            color={Color.lightishBlue}
            value={this.state.expiryDate}
            editable={this.state.editable}
            example="MM/YY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="CVV"
            onChangeText={(cvv) =>
              this.setState({cvv}, () => this.changesMade())
            }
            keyboardType="number-pad"
            color={Color.lightishBlue}
            value={this.state.cvv}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={[styles.inputContainer]}>
        <AutoCompleteText
          placeholder="Issuer"
          onChangeText={(issuer) =>
            this.setState({issuer, issuerClicked: !issuer ? true : false}, () =>
              this.changesMade(),
            )
          }
          keyboardType="default"
          value={this.state.issuer}
          color={Color.lightishBlue}
          editable={this.state.editable}
          array={this.state.refArray}
          onPress={(issuer) => this.showAutoComplete(issuer)}
          clicked={this.state.issuerClicked}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="URL"
          onChangeText={(url) => this.setState({url}, () => this.changesMade())}
          keyboardType="default"
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
          placeholder="User Name"
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
    </View>
  );

  additionalCardInfo = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Card Holder Name"
          onChangeText={(cardHolderName2) =>
            this.setState({cardHolderName2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
          value={this.state.cardHolderName2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Card Number"
          onChangeText={(cardNo2) =>
            this.setState({cardNo2: formatCardNumber(cardNo2)}, () =>
              this.changesMade(),
            )
          }
          keyboardType="number-pad"
          color={Color.lightishBlue}
          value={this.state.cardNo2}
          editable={this.state.editable}
          example="XXXX XXXX XXXX XXXX"
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.cardNo2}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Expiration Date"
            onChangeText={(expiryDate2) =>
              this.setState({expiryDate2: formatExpiry(expiryDate2)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="number-pad"
            color={Color.lightishBlue}
            value={this.state.expiryDate2}
            editable={this.state.editable}
            example="MM/YY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="CVV"
            onChangeText={(cvv2) =>
              this.setState({cvv2}, () => this.changesMade())
            }
            keyboardType="number-pad"
            color={Color.lightishBlue}
            value={this.state.cvv2}
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

  paymentMailingAddress = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 1"
          onChangeText={(address1) =>
            this.setState({address1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.lightishBlue}
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
          color={Color.lightishBlue}
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
          color={Color.lightishBlue}
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
          color={Color.lightishBlue}
          value={this.state.state}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Zip/Postal"
          onChangeText={(zip) => this.setState({zip}, () => this.changesMade())}
          keyboardType="default"
          color={Color.lightishBlue}
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
          editable={this.state.editable}
          nam="Country"
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
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.notes}
            editable={this.state.editable}
          />
        </View>
      </View>
    </View>
  );

  // additionalInformation = () => (
  //   <View>
  //     <View style={styles.inputContainer}>
  //       <InputTextIconDynamic
  //         placeholder="Credit Limit"
  //         onChangeText={this.handleFirstNaame}
  //         icon="dollar-sign"
  //         keyboardType="default"
  //         color={Color.lightishBlue}
  //         value={this.state.address1}
  //       />
  //     </View>
  //     <View style={styles.inputContainer}>
  //       <InputTextDynamic
  //         placeholder="APR"
  //         onChangeText={this.handleFirstNaame}
  //         keyboardType="default"
  //         color={Color.lightishBlue}
  //         value={this.state.address1}
  //       />
  //     </View>
  //     <View style={styles.inputContainer}>
  //       <InputTextIconDynamic
  //         placeholder="Monthly Payment Date"
  //         onChangeText={this.handleFirstNaame}
  //         icon="percent"
  //         keyboardType="default"
  //         color={Color.lightishBlue}
  //         value={this.state.address1}
  //       />
  //     </View>
  //   </View>
  // );

  showAutoComplete = (val) => {
    if (val.label === 'Add')
      this.setState({refBusModal: true, issuerClicked: true});
    else {
      this.setState(
        {
          issuer: val.label,
          issuerId: val.id,
        },
        () => this.setState({hideResult: true, issuerClicked: true}),
      );
    }
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

  getBusinessEntity = async () => {
    const {userData} = this.props;
    if (userData !== null) {
      await lookupType(this.userInfo?.access_token, 'RefBusinessEntity')
        .then((response) => {
          response.pop();
          this.setState({refArray: response});
        })
        .catch((error) => console.log('Ref Business error: ', error));
    }
  };

  changeState = (key, value) => {
    this.setState({[key]: value});
  };

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
  };

  editComponent = (isLoader, modal, array, key, editable, refBusModal) => (
    <View>
      <Text style={styles.title}>Primary Card</Text>
      {this.primaryCard()}
      <View style={styles.gap} />
      <Text style={styles.title}>Additional Card Information</Text>
      {this.additionalCardInfo()}
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
      <Text style={styles.title}>Payment Mailing Address</Text>
      {this.paymentMailingAddress()}
      <View style={styles.gap} />
      <Text style={styles.title}>Notes</Text>
      {this.notes()}
      <View style={styles.gap} />
      {/* <Text style={styles.title}>Additional Information</Text>
        {this.additionalInformation()} */}
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
        access_token={this.userInfo?.access_token}
        refreshingList={this.refreshingList}
      />
    </View>
  );

  onSave = () => {
    this.submit();
  };

  onEdit = () => {
    this.setState({editable: false});
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
    console.log('Red alert');
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

const mapStateToProps = ({userData, country}) => ({
  userData,
  country,
});

export default connect(mapStateToProps)(CreditCard);
