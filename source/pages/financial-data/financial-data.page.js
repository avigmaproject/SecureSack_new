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

import FinancialDataType from '../../components/financial-data-type/financial-data-type.component';

import styles from './financial-data.style';

class FinancialData extends Component {
  constructor() {
    super();
    this.state = {
      isArchive: false,
    };
  }
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
          <ScrollView style={styles.outerContainerView}>
            <FinancialDataType navigation={navigation} archive={isArchive}/>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default FinancialData;
