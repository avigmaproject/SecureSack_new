import { StyleSheet } from "react-native";

const styles = StyleSheet.create({ 
    container: {
        backgroundColor: 'white',
        flex: 1,
       
    },
    title: {

        fontFamily: 'Montserrat-Regular'
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
  searchView: {
    marginTop: 20,
    margin: 7
  },
  aboveButton: {
      width: '100%',
      height: 30,
      padding: 5,
      alignItems: 'flex-end'
  }
 })

export default styles