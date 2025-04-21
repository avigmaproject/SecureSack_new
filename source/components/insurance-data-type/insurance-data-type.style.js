import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(243,243,243)',
    borderRadius: 9,
    width: '100%',
    padding: 15,
    marginTop: 24,
  },
  titleIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginLeft: 15,
    fontFamily: 'PublicSans-Regular',
    color: 'rgb(33, 47, 60)',
  },
  addView: {
    position: 'absolute',
    right: 0,
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 14,
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
  view: {
    padding: 15,
  },
  contentContainerStyle: {
    paddingVertical: 20,
  },
  viewAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'PublicSans-Regular',
    color: 'rgb(33, 47, 60)',
    fontSize: 11,
  },
});

export default styles;
