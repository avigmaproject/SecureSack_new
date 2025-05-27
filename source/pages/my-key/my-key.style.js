import { StyleSheet, StatusBar } from 'react-native';

const styles = StyleSheet.create({
    container: {
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.HEIGHT,
    flex: 1,
    padding: 10
    },
    header: {
        marginTop: 10
    },
    title: {
        fontFamily: 'Montserrat-SemiBold',
        marginLeft:10
    },
    caption: {
        fontFamily: 'Montserrat-Regular',
        marginLeft:10
    },
    text: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 20,
        marginTop: 20,
        marginLeft:10
    },
    tiny: {
    marginVertical: 2,
    minHeight: 19,
    lineHeight: 19,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  inputView: {
    marginTop: 20,
    margin: 7
  },  
  titleView: {
    width: '100%',
    justifyContent: 'center',
  },
  titl: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: 'rgb(33, 47, 60)',
    marginLeft: 10,
  },
  rowObject: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    position: 'absolute',
    right: 0,
  },
})

export default styles