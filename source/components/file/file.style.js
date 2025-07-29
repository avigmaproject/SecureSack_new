import {StyleSheet, Dimensions} from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft:10
    // justifyContent: 'center',
    // alignItems: 'center'
  },
});

export default styles;
