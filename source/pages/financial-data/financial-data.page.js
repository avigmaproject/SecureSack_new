import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Animated, Easing,
} from 'react-native';
import {Title} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';

import FinancialDataType from '../../components/financial-data-type/financial-data-type.component';

import styles from './financial-data.style';
import {BackHandler} from 'react-native';
class FinancialData extends Component {
  constructor() {
    super();
    this.state = {
      isArchive: false,
      slideAnim: new Animated.Value(1500), 
    };
  }
  componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    
      this.state.slideAnim.setValue(500);
      Animated.timing(this.state.slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
    
    this.blurListener = navigation.addListener('blur', () => {
      if (this.backHandler) this.backHandler.remove();
    });
    
  }
  
  componentWillUnmount() {
    if (this.focusListener) this.focusListener();
    if (this.blurListener) this.blurListener();
    if (this.backHandler) this.backHandler.remove();
     }
  

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };
  render() {
    const {navigation} = this.props;
    const {isArchive} = this.state;
    return (
      <SafeAreaView style={styles.outerView}>
        <ImageBackground
          source={require('../../assets/jpg-images/Financial-Data-Background/financial-data-background.jpg')}
          style={styles.backgroundImage}>
          <View style={styles.titleView}>
            <View style={styles.rowObject}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icons name="arrow-back" color="rgb(255, 255, 255)" size={24} />
              </TouchableOpacity>
              <Title style={styles.title}>Financial Data</Title>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => this.setState({isArchive: !isArchive})}>
                  <Icons name={isArchive ? "archive" : "unarchive"} color={"rgb(255, 255, 255)"} size={24} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Animated.ScrollView style={[
    styles.outerContainerView,
    { transform: [{ translateY: this.state.slideAnim }] },
  ]}>
            <FinancialDataType navigation={navigation} archive={isArchive}/>
          </Animated.ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default FinancialData;
