import {StyleSheet, Platform} from 'react-native';

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderRightWidth: 1,
  borderLeftWidth: 1,
  borderBottomWidth: 1,
};

const androidStyles = {
  container: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 0,
  },
  list: {
    backgroundColor: 'white',
    margin: 10,
    marginTop: 0,
  },
};

const iosStyles = {
  container: {
    zIndex: 1,
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3,
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3,
  },
  ...Platform.select({
    android: {...androidStyles},
    ios: {...iosStyles},
  }),
});

export default styles;
