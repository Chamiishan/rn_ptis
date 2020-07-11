import React from 'react';
import { View, TextInput, Modal, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { allowAddLocation, fetchAddress, changeAddValue, addLocation } from '../actions';

class AddLocationModal extends React.Component {

    componentDidMount() {
        if (this.props.sellatitude && this.props.sellatitude != null) {
            this.props.fetchAddress({ latitude: this.props.sellatitude, longitude: this.props.sellongitude });
        }
    }

    addBuilding() {
        if (this.props.fetched_add !== null) {
            // {this.showProgress("Fetching address..")}
            this.props.addLocation(this.props.fetched_add);
        }
    }

    fetchValue() {
        if (this.props.add_loc) {
            if (this.props.sellatitude && this.props.sellatitude != null) {
                // console.log("fetching address");
                // this.props.fetchAddress({ latitude: this.props.sellatitude, longitude: this.props.sellongitude });
            }
            return true;
        } else {
            return false;
        }
    }

    getInputValue() {
        // console.log("latitude: ",this.props.sellatitude);

        return this.props.sellatitude + ", " + this.props.sellongitude;
    }

    onAddressChange(text) {
        this.props.changeAddValue(text);
    }

    showProgress(msg) {
        if (this.props.fetched_add === null) {
            return (
                <View style={styles.progViewStyle}>
                    <ActivityIndicator style={styles.progStyle} size="small" color="#0000ff" />
                    <Text>{msg}</Text>
                </View>
            );
        }
    }

    render() {
        return (
            <Modal
                transparent
                visible={this.fetchValue()}
                animationType={'slide'}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Property Location</Text>
                        <TextInput style={styles.txtInputStyle} placeholder="Location" value={this.getInputValue()}></TextInput>
                        <TextInput style={styles.txtInputStyle} multiline placeholder="Address"
                            value={this.props.fetched_add == null ? "" : this.props.fetched_add.display_name}
                            onChangeText={(add) => this.onAddressChange(add)}></TextInput>
                        {this.showProgress("Fetching address..")}
                        <View style={styles.btnContainerStyle}>
                            <TouchableOpacity style={styles.btnStyle} onPress={() => this.addBuilding()}>
                                <Text style={styles.btnTxtStyle}>Ok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnStyle} onPress={() => this.props.allowAddLocation(false)}>
                                <Text style={styles.btnTxtStyle}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#00000070',
    },
    innerContainer: {
        backgroundColor: 'white',
        elevation: 5,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 10,
        borderRadius: 5
    },
    btnContainerStyle: {
        flexDirection: "row-reverse",
    },
    txtInputStyle: {
        borderColor: "#494949",
        borderWidth: 0.5,
        margin: 5
    },
    title: {
        margin: 5,
        fontSize: 20,
    },
    btnStyle: {
        elevation: 15,
        alignItems: "center",
        width: '20%',
        marginTop: 5,
        marginBottom: 5,
        padding: 5,
    },
    btnTxtStyle: {
        fontSize: 15,
        color: '#4285f4'
    },
    progViewStyle: {
        margin: 10,
        flexDirection: "row"
    },
    progStyle: {
        marginRight: 10
    }
});

const mapStateToProps = (state) => {
    return {
        add_loc: state.prop.to_add_loc,
        fetched_add: state.prop.fetched_add
    };
}

export default connect(mapStateToProps, {
    allowAddLocation, fetchAddress, changeAddValue, addLocation
})(AddLocationModal);