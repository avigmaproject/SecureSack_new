import {StyleSheet, StatusBar} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  outerView: {
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.HEIGHT,
    flex: 1,
  },
  searchView: {
    marginLeft: 20,
    marginRight: 20,
    marginTop:10,
    
  },
  titleView: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    padding: 15,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: 'white',
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
  outerContainerView: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});

export default styles;