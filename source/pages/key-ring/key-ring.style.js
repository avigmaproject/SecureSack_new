import {StyleSheet, StatusBar, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15
  },
  title: {
    fontFamily: 'PublicSans-Regular',
    fontSize: 18,
  },
  caption: {
    fontFamily: 'PublicSans-ExtraLight',
    fontSize: 16,
    marginLeft: 20, 
  },
  outerView: {
    marginTop: 30,
  },
  alignHor: {
    flexDirection: 'row',
  },
  iconView: {
      marginRight: 15
  },  
  outerView: {
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.HEIGHT,
    flex: 1,
    padding: 10
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  modalList: {
    height: Dimensions.get('window').height * .3,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    padding: 17,
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
  miniContainer: {
    paddingTop: 1,
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  miniInputContainer: {
    flex: 1,
  },
});

export default styles;
