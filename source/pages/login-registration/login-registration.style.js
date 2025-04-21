import { StyleSheet, Dimensions } from "react-native"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212F3C"
    },
    circle: {
        width: "100%",
        height: windowHeight/3.5,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        color: "#FFFFFF",
        fontFamily: "Rosarivo-Regular",
        fontSize: 30
    },
    logoSecure: {
        color: "#FB9337"
    },
    middleContainer: {
        padding: 20
    },
    switcher: {
        flexDirection: "row"
    },
    switcherText: {
        fontSize: 20,
        marginRight: 20,
        fontFamily: "PublicSans-Regular"
    },
})

export default styles;