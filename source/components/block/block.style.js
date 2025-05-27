import {StyleSheet, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

console.log(
  Dimensions.get('screen').width / 2.5,
  Dimensions.get('window').width / 2.5,
);

const spacing = 10;
const width1 = (Dimensions.get('window').width - 4 * 10) / 2;

const styles = StyleSheet.create({
  imageBackgroundStyle: {
    width: width / 2.3,
    height: height / 4.5,
    // marginHorizontal: spacing,
    // flex: 1,
    // justifyContent: 'space-between',
  },
  title: {
    color: 'black',
    position: 'absolute',
    bottom: 30,
    left: 10,
    fontSize: 18,
    textAlign: 'left',
    fontFamily: 'PublicSans-SemiBold',
  },
  icon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imageStyle: {
    borderRadius: 19,
  },
  container: {
    
    // marginVertical: 10,
    // marginHorizontal: spacing,
  },
});

export default styles;
