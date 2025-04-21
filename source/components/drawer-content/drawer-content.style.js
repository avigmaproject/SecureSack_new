import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PublicSans-Bold'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontFamily: 'PublicSans-ExtraLight'
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#F4F4F4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatarView: {
      flexDirection: 'row',
      marginTop: 15
  },
  userInfoView: {
      marginLeft: 15,
      flexDirection: 'column'
  },
});

export default styles;
