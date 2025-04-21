import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginTop: 13,
  },
  label: {
    fontSize: 15,
    fontFamily: 'PublicSans-Regular',
    paddingBottom: 10,
  },
  icon: {
    position: 'absolute',
    right: 0,
  },
  labelText: {
    fontSize: 11,
    fontFamily: 'PublicSans-Regular',
    color: 'rgba(33, 47, 60, 0.5)'
  }
});

export default styles;
