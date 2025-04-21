import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  modalList: {
    maxHeight: '85%',
    width: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
  },
  labelView: {
    borderBottomWidth: 0.5,
    borderColor: 'rgb(33, 47, 60)',
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
    fontFamily: 'PublicSans-Regular',
    textAlign: 'center',
  },
});

export default styles;