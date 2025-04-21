import {StyleSheet, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  fileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInnerContainer: {
    borderRadius: 9,
    backgroundColor: 'rgba(33, 47, 60, 0.1)',
    width: width / 2.5,
    height: height / 4.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 10,
  },
  icon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,
    zIndex: 9999,
  },
  fileName: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 12,
    textAlign: 'center',
    margin: 5
  },
});

export default styles;
