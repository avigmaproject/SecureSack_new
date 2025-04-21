import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  view: {
    padding: 10,
  },
  titleSubTitle: {
    flexDirection: 'column',
    padding: 5,
    justifyContent: 'center',
  },
  catTitle: {
    fontSize: 16,
    marginTop: 3,
    alignItems: 'center',
  },
  arrowView: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgb(243,243,243)',
    width: '100%',
    padding: 15,
    borderRadius: 9,
  },
  titleIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'PublicSans-SemiBold',
    color: 'rgb(33, 47, 60)',
  },
  addView: {
    position: 'absolute',
    right: 0,
  },
});

export default styles;
