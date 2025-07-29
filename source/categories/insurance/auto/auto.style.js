import {StyleSheet, StatusBar} from 'react-native';

const styles = {
  container: {
    padding: 15,
  
  },
  title: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    color: 'rgb(33, 47, 60)',
  },
  inputContainer: {
    justifyContent: 'center',
  },
  miniContainer: {
    paddingTop: 1,
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-between',
  },
  miniInputContainer: {
    flex: 1,
  },
  gap: {
    marginTop: 50,
  },
  outerView: {
    backgroundColor: 'rgb(248, 249, 250)',
    paddingTop: StatusBar.HEIGHT,
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
    backgroundColor: 'rgb(248, 249, 250)',
  },
  titleView: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    padding: 15,
  },
  labelText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
  },
  clipboard: {
    position: 'absolute',
    right: 0,
  },
  notes: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: 'rgba(33, 47, 60, 0.6)',
  },
};

export default styles;
