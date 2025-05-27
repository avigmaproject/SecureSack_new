import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
    marginTop: 30,
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15
  },
  title: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
  },
  caption: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginLeft: 20,
  },
  outerView: {
    marginTop: 30,
  },
  alignHor: {
    flexDirection: 'row',
  },
});

export default styles;
