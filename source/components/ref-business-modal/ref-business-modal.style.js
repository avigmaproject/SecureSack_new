import {StyleSheet, Dimensions} from 'react-native';

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
    height: Dimensions.get('window').height * .5,
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
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default styles;
