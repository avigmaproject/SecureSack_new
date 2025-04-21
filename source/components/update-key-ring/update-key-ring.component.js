import React, {Component} from 'react';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import {Chip, Text, Title} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux'
import qs from 'qs';

import {updateKey} from '../../configuration/api/api.functions.js'
import InputTextAdd from '../input-text-add/input-text-add.component';

import styles from './update-key-ring.style';

class UpdateKeyRing extends Component {
    initialState = {
        editors: [],
        viewes: [],
        edit: '',
        view: ''
    }
    constructor(){
        super();
        this.state = {
            ...this.initialState
        }
    }

    editors = () => (
        <FlatList
            data={this.state.editors}
            renderItem={({item}) => this.chip(item)}
            numColumns={1}
        />
    )

    chip = (item) => (
        <View style={styles.row}>
        <Chip
            onPress={() => {}}
            onClose={() => {}}
            style={styles.tiny}>
            {item}
        </Chip>
        </View>
    )

    editArray = () => {
        const {edit} = this.state
        if (edit.length !== 0){
            this.state.editors.push(edit)
            this.setState({edit: ''})
        }
    }

        viewers = () => (
        <FlatList
            data={this.state.viewes}
            renderItem={({item}) => this.chip(item)}
            numColumns={1}
        />
    )

    viewerArray = () => {
        const {view} = this.state
        if (view.length !== 0){
            this.state.viewes.push(view)
            this.setState({view: ''})
        }
    }

    addEditorsViewers = async () => {
        const { data, closeSheet } = this.props;
        const {editors, viewes} = this.state
        if (editors.length !== 0 || viewes.length !== 0){
            let apidata = JSON.stringify({
            name: data.name,
            editors: editors,
            viewers: viewes
            })
            console.log("DATA: ", apidata, this.props.userData.userData.access_token, data.id)
            await updateKey(this.props.userData.userData.access_token, data.id, apidata)
            .then(response => {
                console.log("Update response: ", response)
                closeSheet()
            })
            .catch(error => console.log("Error: ", error))
        }
    }

    render(){
        const {edit, view} = this.state
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                <TouchableOpacity style={styles.aboveButton} onPress={() => this.addEditorsViewers()}>
                    <Icons name="done" color="#000000" size={25}/>
                </TouchableOpacity>
                <Title style={styles.title}> Editors </Title> 
                    {this.editors()}
                <Title style={styles.title}> Viewers </Title>
                    {this.viewers()}
                        <View style={styles.searchView}>
                            <InputTextAdd 
                                placeholder="Editors"
                                onChangeText={(edit) => this.setState({ edit })}
                                value={edit}
                                onAdd={() => this.editArray()}
                            /> 
                        </View>
                        <View style={styles.searchView}>
                            <InputTextAdd 
                                placeholder="Views"
                                onChangeText={(view) => this.setState({ view })}
                                value={view}
                                onAdd={() => this.viewerArray()}
                            /> 
                        </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = ({userData}) => ({
    userData
})

export default connect(mapStateToProps)(UpdateKeyRing);