import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Title} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';

import PersonalAssetsData from '../../components/personal-assets-data-type/personal-assets-data-type.component.js';
import {BackHandler} from 'react-native';
import styles from './personal-assets.style';

class PersonalAssets extends Component {
    constructor() {
    super();
    this.state = {
      isArchive: false,
    };
  }
  componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    
    
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
          source={require('../../assets/jpg-images/Personal-Assets-Background/personal-assets-background.jpg')}
          style={styles.backgroundImage}>
          <View style={styles.titleView}>
            <View style={styles.rowObject}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icons name="arrow-back" color="rgb(255, 255, 255)" size={24} />
              </TouchableOpacity>
              <Title style={styles.title}>Personal Assets</Title>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => this.setState({isArchive: !isArchive})}>
                  <Icons name={isArchive ? "archive" : "unarchive"} color={"rgb(255, 255, 255)"} size={24} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView style={styles.outerContainerView}>
            <PersonalAssetsData navigation={navigation} archive={isArchive}/>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default PersonalAssets;
