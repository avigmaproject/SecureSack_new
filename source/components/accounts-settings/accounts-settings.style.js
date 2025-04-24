import {StyleSheet, StatusBar} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 30,
  },
  outerView: {
    marginTop: 30,
  },
  inputContainer: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 18,
    color:"rgb(33, 47, 60)"
  },
  buttonContainer: {
    paddingTop: 20,
  },
  note: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 15,
    marginTop: 10,
    color:"rgb(33, 47, 60)"
  }
});

export default styles;
