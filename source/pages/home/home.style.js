import {StyleSheet, Dimensions, StatusBar} from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    // alignItems: 'center',
    paddingTop: StatusBar.HEIGHT,
    flex: 1,
    // marginHorizontal: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 25,
  },
  fingerPrintModal: {
    padding: 20,
    justifyContent: 'center',
    height: height / 3.5,
    backgroundColor: '#212F3C',
    borderRadius: 9,
  },
  modalText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
  },
  modelTextView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#FB9337',
    borderRadius: 9,
    width: '40%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  modalButtonTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
    padding: 15,
  },
  modalImageView: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageStyle: {
    height: 50,
    width: 50,
  },
  innerContainer: {
    marginHorizontal: 20,
    // width: '90%',
    flex: 1,
  },
  grettingText: {
    fontSize: 28,
    fontFamily: 'Montserrat',
    fontWeight:'400',
     color:"black"
  },
  grettingView: {
    marginTop: 18,
  },
  name: {
    fontFamily: 'Montserrat',
    color:"black",
    fontWeight:'660'
    
  },
});

export default styles;
