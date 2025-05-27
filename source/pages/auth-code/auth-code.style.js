import {StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#212F3C',
    padding: 20,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  toastText: {
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
  },
  circle: {
    width: '100%',
    height: windowHeight / 3.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: '#FFFFFF',
    fontFamily: 'Rosarivo-Regular',
    fontSize: 30,
  },
  logoSecure: {
    color: '#FB9337',
  },
  background: {
    backgroundColor: '#212F3C',
  },
};
export default styles;
