import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  input: {
    color: 'rgb(33, 47, 60)',
    fontFamily: 'PublicSans-Regular',
    width: '100%',
    fontSize: 15,
    backgroundColor: '#80000000',
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 55,
    // zIndex: 9999999,
  },
  labelView: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgb(33, 47, 60)',
    height: 25,
    justifyContent: 'center',
    paddingLeft: 5,
    backgroundColor: '#ffffff',
  },
  label: {
    fontFamily: 'PublicSans-Regular',
    color: 'rgb(33, 47, 60)',
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
});

export default styles;
