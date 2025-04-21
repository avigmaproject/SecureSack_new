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

import GovernmentRecordsData from '../../components/government-records-data-type/government-records-data-type.component.js';

import styles from './government-records.style';

class GovernmentRecords extends Component {
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
          source={require('../../assets/jpg-images/Government-Record-Background/government-records-background.jpg')}
          style={styles.backgroundImage}>
          <View style={styles.titleView}>
            <View style={styles.rowObject}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icons name="arrow-back" color="rgb(255, 255, 255)" size={24} />
              </TouchableOpacity>
              <Title style={styles.title}>Government Records</Title>
            </View>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => this.setState({isArchive: !isArchive})}>
                  <Icons name={isArchive ? "archive" : "unarchive"} color={"rgb(255, 255, 255)"} size={24} />
                </TouchableOpacity>
              </View>
          </View>
          <ScrollView style={styles.outerContainerView}>
            <GovernmentRecordsData navigation={navigation} archive={isArchive}/>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default GovernmentRecords;
