import React, { Component } from 'react';
import { Modal, View, Image, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { showPropModal, allowViewDetails, propertySelect } from '../actions';

class PropertyListModal extends Component {

    getItem(item) {
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.showProperty(item)}>
                <Image source={this.getPropImg(item.propertyTax.dues_status)} />
                <Text style={styles.title}> ID: {item.gisid}, DUES: {item.propertyTax.dues_status}</Text>
            </TouchableOpacity>
        );
    }

    getPropImg(dues_status) {
        if (dues_status === 'Pending with delay') {
            return require('./assets/home_pend_delayed.png');
        } else if (dues_status === "Pending") {
            return require('./assets/home_pend.png');
        } else {
            return require('./assets/home_paid.png');
        }
    }

    showProperty(markerData) {
        this.props.showPropModal(!this.props.showhide);
        this.props.allowViewDetails(true);
        this.props.propertySelect({ propertyDetail: markerData });
    }

    onButtonPress() {
        this.props.showPropModal(!this.props.showhide);
    }

    render() {

        return (
            <Modal
                transparent
                visible={this.props.showhide}
                animationType={'slide'}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerContainer}>
                        <FlatList
                            data={this.props.selPropArray}
                            renderItem={item => this.getItem(item.item)}
                            keyExtractor={item => item.gisid}
                        >
                        </FlatList>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: 0.5
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#00000070',
    },
    innerContainer: {
        backgroundColor: 'white',
        elevation: 5,
        margin: 20,
        padding: 10,
        paddingTop: 20

    },
    item: {
        marginVertical: 8,
        color: '#000',
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#adadad',
        alignItems: "center"
    },
    title: {
        fontSize: 16,
    },
});

const mapStatToProps = (state) => {
    return {
        showhide: state.map.show_hide,
        selPropArray: state.map.sel_prop_arr
    }
}

export default connect(mapStatToProps, { showPropModal, allowViewDetails, propertySelect })(PropertyListModal);