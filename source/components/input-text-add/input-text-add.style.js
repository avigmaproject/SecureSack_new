import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  input: {
    color: '#FFFFFF',
    fontFamily: 'PublicSans-Regular',
    padding: 15,
    flex: 1,
    fontSize: 17,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 47, 60, 0.1)',
    height: 60,
    width: '100%',
    borderRadius: 9,
  },
  iconBackgroundView: {
    width: 54,
    height: 43,
    backgroundColor: '#FB9337',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    margin: 15,
  },
});

export default styles;
