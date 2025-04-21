import {StyleSheet, StatusBar} from 'react-native';

const styles = StyleSheet.create({
  outerView: {
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.HEIGHT,
    flex: 1,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  outerContainerView: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  titleView: {
      width: '100%',
      height: 100,
      justifyContent: 'center',
      padding: 15
  },
  title: {
      fontFamily: 'PublicSans-Bold',
      fontSize: 20,
      color: 'rgb(33, 47, 60)',
      marginLeft: 15
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
