import {StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  toastText: {
    fontFamily: 'PublicSans-Regular',
    color: '#FFFFFF',
  },
  inputContainer: {
    paddingTop: 20,
  },
  buttonContainer: {
    paddingTop: 20,
  },
  extras: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  extrasText: {
    fontFamily: 'PublicSans-Regular',
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center'
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 9
  },
  fingerprint: {
    width: 60,
    height: 60,
  },
});

export default styles;
