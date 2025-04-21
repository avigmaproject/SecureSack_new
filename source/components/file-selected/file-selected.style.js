import {StyleSheet} from 'react-native';

import {Color} from '../../assets/color/color'

const styles = StyleSheet.create({
    selectedFile: {
        height: 60,
        width: '100%',
        backgroundColor: Color.blackTrans,
        borderRadius: 9,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center'
    },
    container: {
        padding: 7
    },
    row: {
        flexDirection: 'row'
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 50,
        backgroundColor: Color.orange,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fileName: {
        marginLeft: 10,
        fontFamily: 'PublicSans-Regular'
    },
    fileSize: {
        alignItems: 'flex-end'
    }
})

export default styles