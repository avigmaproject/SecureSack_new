import {StyleSheet, StatusBar} from 'react-native';
const styles = StyleSheet.create({
  titleView: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    padding: 15,
  },
  title: {
    fontFamily: 'PublicSans-Bold',
    fontSize: 20,
    color: 'rgb(33, 47, 60)',
    marginLeft: 15,
  },
  rowObject: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    position: 'absolute',
    right: 0,
  },
});
export default styles;
