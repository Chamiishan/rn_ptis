import React from 'react';
import { CardSection, Form_Input_1, Button, AppPicker } from '../common';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView, Modal, ActivityIndicator } from 'react-native';
import ImageSelectView from './ImageSelectView';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
    addProperty, changePropValue, changeTaxValue,
    saveInitiated, setSelMarker, saveDetail,
    addPropertyMarker, updatePropertyMarker, resetValues,
    changeLocValue, changeNewLocValue
} from '../actions';
import { CHANGE_PROPERTY_VALUE, CHANGE_TAX_VALUE, CHANGE_LOCATION_VALUE, CHANGE_NEW_LOCATION_VALUE } from '../utils/constants';
import Snackbar from 'react-native-snackbar';

class PropertyDetail extends React.Component {

    // componentDidUpdate(prevProps) {
    //     console.log("componentDidUpdate prop detail");
    // }

    static getDerivedStateFromProps(nextProps) {
        return null;
    }

    constructor(props) {
        super(props);

        this.props.resetValues();
        if (props.gisid !== undefined) {
            this.props.addProperty(
                {
                    certificate_no: props.certificate_no,
                    build_no: props.build_no,
                    certificate_occupation_date: props.certificate_occupation_date,
                    certificate_occupation_type: props.certificate_occupation_type,
                    premise_date: props.premise_date,
                    premise_status: props.premise_status,
                    build_type: props.build_type,
                    build_class: props.build_class,
                    build_age: props.build_age,
                    build_floor_no: props.build_floor_no,
                    build_floor_length_fts: props.build_floor_length_fts,
                    build_floor_width_fts: props.build_floor_width_fts,
                    build_area_fts: props.build_area_fts,
                    build_use: props.build_use,
                    pin_code: props.pin_code,
                    adhar_no: props.adhar_no,
                    images: props.images,
                    address: props.address,
                    city: props.city,
                    state: props.state,
                    country: props.country,
                    gisid: props.gisid,
                    latitude: props.latitude,
                    longitude: props.longitude,
                    propertyTax: {
                        ptin_no: props.propertyTax.ptin_no,
                        dues_as_on_amt: props.propertyTax.dues_as_on_amt,
                        dues_status: props.propertyTax.dues_status,
                        tax_total_amt: props.propertyTax.tax_total_amt,
                        to_be_paid_amt: props.propertyTax.to_be_paid_amt,
                        paid_amt: props.propertyTax.paid_amt,
                        arrear_tax: props.propertyTax.arrear_tax,
                        arrear_inter: props.propertyTax.arrear_inter,
                        current_tax: props.propertyTax.current_tax,
                        current_inter: props.propertyTax.current_inter,
                        cheque_bounce: props.propertyTax.cheque_bounce,
                        rebate_percent_5: props.propertyTax.rebate_percent_5
                    },
                    cap_location: {
                        id: props.cap_location.id,
                        loc_latitude: props.cap_location.loc_latitude,
                        loc_longitude: props.cap_location.loc_longitude,
                        loc_address: props.cap_location.loc_address,
                        loc_city: props.cap_location.loc_city,
                        loc_state: props.cap_location.loc_state,
                        loc_country: props.cap_location.loc_country
                    }
                }
            );
        } else {
            this.props.addProperty(
                {
                    certificate_no: "",
                    build_no: "",
                    certificate_occupation_date: "",
                    certificate_occupation_type: "",
                    premise_date: "",
                    premise_status: "",
                    build_type: "Residential",
                    build_class: "",
                    build_age: "",
                    build_floor_no: 0,
                    build_floor_length_fts: 0,
                    build_floor_width_fts: 0,
                    build_area_fts: 0,
                    build_use: "Residential",
                    pin_code: "",
                    adhar_no: "",
                    images: "",
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    gisid: "",
                    latitude: 0,
                    longitude: 0,
                    propertyTax: {
                        ptin_no: "",
                        dues_as_on_amt: 0,
                        dues_status: "Paid",
                        tax_total_amt: 0,
                        to_be_paid_amt: 0,
                        paid_amt: 0,
                        arrear_tax: 0,
                        arrear_inter: 0,
                        current_tax: 0,
                        current_inter: 0,
                        cheque_bounce: 0,
                        rebate_percent_5: 0
                    },
                    cap_location: {
                        id: -1,
                        loc_latitude: 0,
                        loc_longitude: 0,
                        loc_address: "",
                        loc_city: "",
                        loc_state: "",
                        loc_country: ""
                    }
                }
            );
        }

        // this.props.setSelMarker({
        //     latitude: null, longitude: null
        // })
    }

    getFormInput(label, value, key, type, error) {
        return (
            <CardSection>
                <Form_Input_1 label={label} value={value} error={value === "" && this.props.saveInit !== undefined && this.props.saveInit ? label + " is required." : ""} onChangeText={(text) => this.onChangeText(key, text, type)} />
            </CardSection>
        );
    }

    getPicker(key, label, picker_items, value, type) {
        return (
            <CardSection>
                <AppPicker label={label} picker_items={picker_items}
                    onChangeText={(text) => this.onChangeText(key, text, type)} value={value} />
            </CardSection>
        );
    }

    onChangeText(key, value, type) {
        // const { build_no } = this.props.propertyDetail;
        if (type === CHANGE_PROPERTY_VALUE) {
            this.props.changePropValue({ key: key, value: value });
        } else if (type === CHANGE_TAX_VALUE) {
            this.props.changeTaxValue({ key: key, value: value });
        } else if (type === CHANGE_LOCATION_VALUE) {
            this.props.changeLocValue({ key: key, value: value });
        } else if (type === CHANGE_NEW_LOCATION_VALUE) {
            this.props.changeNewLocValue({ key: key, value: value });
        }
    }

    getTitle(title) {
        return (
            <View style={{ padding: 5 }}>
                <Text style={styles.titleText} >{title}</Text>
            </View>
        );
    }

    saveProperty() {
        // Snackbar.show({
        //     title: 'Details Saved',
        //     duration: Snackbar.LENGTH_SHORT,
        //     color: '#fff',
        //     backgroundColor: '#000'
        // });

        this.props.saveInitiated(true);

        // this.props.allowSave(true);
        //check all fields
        const { propertyDetail } = this.props;

        if (propertyDetail.build_no.length === 0) {

        }

        // else if (propertyDetail.certificate_no.length === 0) {
        //     this.props.allowSave(false);
        //     console.log("certificate_nosaving false: ", this.props.allow_save);
        // } else if (propertyDetail.certificate_occupation_date.length === 0) {
        //     this.props.allowSave(false);
        //     console.log("certificate_occupation_datesaving false: ", this.props.allow_save);
        // } else if (propertyDetail.certificate_occupation_type.length === 0) {
        //     this.props.allowSave(false);
        //     console.log("certificate_occupation_typesaving false: ", this.props.allow_save);
        // } 

        // else if (propertyDetail.premise_date.length === 0) {
        //     this.props.allowSave(false);
        //     console.log("premise_datesaving false: ", this.props.allow_save);
        // } else if (propertyDetail.premise_status.length === 0) {
        //     this.props.allowSave(false);
        //     console.log("premise_statussaving false: ", this.props.allow_save);
        // } 
        
        else if (propertyDetail.build_type.length === 0) {
        } else if (propertyDetail.build_class.length === 0) {
        } else if (propertyDetail.build_age.length === 0) {
        } else if (propertyDetail.build_use.length === 0) {
        } else if (propertyDetail.pin_code.length === 0) {
        }
        // else if (propertyDetail.adhar_no.length === 0) {
        //     this.props.allowSave(false);
        //     console.log("adhar_nosaving false: ", this.props.allow_save);
        // } 

        else if (propertyDetail.address.length === 0) {
        } else if (propertyDetail.city.length === 0) {
        } else if (propertyDetail.state.length === 0) {
        } else if (propertyDetail.country.length === 0) {
        } else if (propertyDetail.latitude == 0.0) {
        } else if (propertyDetail.propertyTax.ptin_no.length === 0) {
        } else if (propertyDetail.propertyTax.dues_status.length === 0) {
        } else {

            var upload_status = true;
            for (var i = 0; i < this.props.imgArr.length; i++) {
                if (this.props.imgArr[i].upload_status == "uploading")
                    upload_status = false;
            }

            if (!upload_status) {
                Snackbar.show({
                    title: 'File upload is in progress.',
                    duration: Snackbar.LENGTH_LONG,
                    color: '#fff',
                    backgroundColor: '#000'
                });
            } else {
                if (this.props.new_cap_location != null) {
                    this.props.saveDetail({ property: { ...propertyDetail, cap_location: this.props.new_cap_location }, imgArr: this.props.imgArr });
                } else {
                    this.props.saveDetail({ property: propertyDetail, imgArr: this.props.imgArr });
                }
            }
        }
    }

    // checkUploadStatus() {
    //     for (var i = 0; i < this.props.imgArr.length; i++) {
    //         if (this.props.imgArr[i].upload_status == "uploading")
    //             return true;
    //     }
    //     return false;
    // }

    showLocOnMap() {

        const { propertyDetail } = this.props;

        const { new_cap_location } = this.props;

        if (new_cap_location != null) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', alignItems: "center" }}>
                    <Button onPress={() => Actions.showmap({ propertyDetail })}>Select Location</Button>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
                        <Text>{new_cap_location.loc_latitude + ", "} </Text>
                        <Text>{new_cap_location.loc_longitude}</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, flexDirection: 'column', alignItems: "center" }}>
                    <Button onPress={() => Actions.showmap({ propertyDetail })}>Select Location</Button>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
                        <Text>{propertyDetail === null ? this.props.saveInit ? "Location is required" : "" : propertyDetail.cap_location.loc_latitude + ", "} </Text>
                        <Text>{propertyDetail === null ? "" : propertyDetail.cap_location.loc_longitude}</Text>
                    </View>
                </View>
            );
        }

    }

    getLocationDetail() {
        const { propertyDetail } = this.props;

        const { new_cap_location } = this.props;

        if (new_cap_location != null) {
            return (
                <View>
                    {this.getFormInput('Address', new_cap_location.loc_address, "loc_address", CHANGE_NEW_LOCATION_VALUE, "")}
                    {this.getFormInput('City', new_cap_location.loc_city, "loc_city", CHANGE_NEW_LOCATION_VALUE, "")}
                    {this.getFormInput('State', new_cap_location.loc_state, "loc_state", CHANGE_NEW_LOCATION_VALUE, "")}
                    {this.getFormInput('Country', new_cap_location.loc_country, "loc_country", CHANGE_NEW_LOCATION_VALUE, "")}
                </View>
            );
        } else {
            return (
                <View>
                    {this.getFormInput('Address', propertyDetail === null ? "" : propertyDetail.cap_location.loc_address, "loc_address", CHANGE_LOCATION_VALUE, "")}
                    {this.getFormInput('City', propertyDetail === null ? "" : propertyDetail.cap_location.loc_city, "loc_city", CHANGE_LOCATION_VALUE, "")}
                    {this.getFormInput('State', propertyDetail === null ? "" : propertyDetail.cap_location.loc_state, "loc_state", CHANGE_LOCATION_VALUE, "")}
                    {this.getFormInput('Country', propertyDetail === null ? "" : propertyDetail.cap_location.loc_country, "loc_country", CHANGE_LOCATION_VALUE, "")}
                </View>
            );
        }
    }

    getPropertyLocationDetail() {
        const { propertyDetail } = this.props;

        const { new_cap_location } = this.props;

        if (new_cap_location != null) {
            return (
                <View>
                    {this.getFormInput('Address', new_cap_location.address, "address", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('City', new_cap_location.city, "city", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('State', new_cap_location.state, "state", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('Country', new_cap_location.country, "country", CHANGE_PROPERTY_VALUE, "")}
                </View>
            );
        } else {
            return (
                <View>
                    {this.getFormInput('Address', propertyDetail === null ? "" : propertyDetail.address, "address", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('City', propertyDetail === null ? "" : propertyDetail.city, "city", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('State', propertyDetail === null ? "" : propertyDetail.state, "state", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('Country', propertyDetail === null ? "" : propertyDetail.country, "country", CHANGE_PROPERTY_VALUE, "")}
                </View>
            );
        }
    }

    showSaveProgress() {
        if (this.props.saving_details) {
            return (
                <Modal
                    transparent={true}
                    formSheet
                    visible={this.props.saving_details}
                    animationType="fades"
                >

                    <View style={{
                        flexGrow: 1,
                        justifyContent: 'space-around',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}>
                        <View style={{ backgroundColor: '#fff', padding: 20, alignItems: "center" }}>
                            <ActivityIndicator size={'large'} />
                        </View>
                    </View>
                </Modal>
            );
        }
    }

    saveDetails() {
        if (this.props.details_saved) {

            Snackbar.show({
                title: 'Details Saved',
                duration: Snackbar.LENGTH_LONG,
                color: '#fff',
                backgroundColor: '#000'
            });

            const { propertyDetail } = this.props;

            const { new_cap_location } = this.props;

            if (this.props.gisid) {
                if (this.props.new_cap_location !== null) {
                    this.props.updatePropertyMarker({ ...propertyDetail, cap_location: new_cap_location });
                } else {
                    this.props.updatePropertyMarker(this.props.propertyDetail);
                }
            } else {
                if (this.props.new_cap_location !== null) {
                    this.props.addPropertyMarker({ ...propertyDetail, cap_location: new_cap_location });
                } else {
                    this.props.addPropertyMarker(this.props.propertyDetail);
                }
            }
            this.props.resetValues();
            Actions.pop();

        }
    }

    render() {

        const { propertyDetail } = this.props;

        // const { ptin_no, arrear_tax, arrear_inter, current_tax, current_inter, tax_total_amt, to_be_paid_amt, paid_amt, dues_as_on_amt,
        //     dues_status, cheque_bounce, rebate_percent_5 } = propertyTax;

        return (
            <ScrollView alwaysBounceVertical={true} bounces={true}>
                <View>

                    {this.props.gisid ? this.getTitle('ID : ' + (propertyDetail === null ? "" : propertyDetail.gisid)) : null}
                    {this.getFormInput('Building No.', propertyDetail === null ? "" : propertyDetail.build_no, "build_no", CHANGE_PROPERTY_VALUE, "")}

                    {/* {this.getFormInput('Type', propertyDetail === null ? "" : propertyDetail.build_type, "build_type", CHANGE_PROPERTY_VALUE, "")} */}
                    {this.getPicker("build_type", 'Type', ["Residential", "Commercial"], propertyDetail === null ? "Residential" : propertyDetail.build_type, CHANGE_PROPERTY_VALUE)}

                    {this.getFormInput('Class', propertyDetail === null ? "" : propertyDetail.build_class, "build_class", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('Pin Code', propertyDetail === null ? "" : propertyDetail.pin_code, "pin_code", CHANGE_PROPERTY_VALUE, "")}
                    {this.getPropertyLocationDetail()}
                    {/* {this.getFormInput('Address', propertyDetail === null ? "" : propertyDetail.address, "address", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('City', propertyDetail === null ? "" : propertyDetail.city, "city", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('State', propertyDetail === null ? "" : propertyDetail.state, "state", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('Country', propertyDetail === null ? "" : propertyDetail.country, "country", CHANGE_PROPERTY_VALUE, "")} */}

                    {this.getTitle('Floor Details')}
                    {this.getFormInput('Floor numbers', propertyDetail === null ? "" : propertyDetail.build_floor_no, "build_floor_no", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('Floor length', propertyDetail === null ? "" : propertyDetail.build_floor_length_fts, "build_floor_length_fts", CHANGE_PROPERTY_VALUE, "")}
                    {this.getFormInput('Floor width', propertyDetail === null ? "" : propertyDetail.build_floor_width_fts, "build_floor_width_fts", CHANGE_PROPERTY_VALUE, "")}

                    {this.getTitle('Building Details')}
                    {this.getFormInput('Building Area', propertyDetail === null ? "" : propertyDetail.build_area_fts, "build_area_fts", CHANGE_PROPERTY_VALUE, "")}

                    {this.getPicker("build_use", 'Building Use', ["Residential", "Shops and Shopping Complexes", "Public Use"], propertyDetail === null ? "Residential" : propertyDetail.build_use, CHANGE_PROPERTY_VALUE)}

                    {this.getFormInput('Building Age', propertyDetail === null ? "" : propertyDetail.build_age, "build_age", CHANGE_PROPERTY_VALUE, "")}

                    {this.getTitle('Tax Details')}
                    {this.getFormInput('PTIN No', propertyDetail === null ? "" : propertyDetail.propertyTax.ptin_no, "ptin_no", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('Area Tax', propertyDetail === null ? "" : propertyDetail.propertyTax.arrear_tax, "arrear_tax", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('Area Interest', propertyDetail === null ? "" : propertyDetail.propertyTax.arrear_inter, "arrear_inter", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('Current Tax', propertyDetail === null ? "" : propertyDetail.propertyTax.current_tax, "current_tax", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('Current Interest', propertyDetail === null ? "" : propertyDetail.propertyTax.current_inter, "current_inter", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('Tax total amt.', propertyDetail === null ? "" : propertyDetail.propertyTax.tax_total_amt, "tax_total_amt", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('To be paid amt.', propertyDetail === null ? "" : propertyDetail.propertyTax.to_be_paid_amt, "to_be_paid_amt", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('Paid Amt.', propertyDetail === null ? "" : propertyDetail.propertyTax.paid_amt, "paid_amt", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('Dues Amt.', propertyDetail === null ? "" : propertyDetail.propertyTax.dues_as_on_amt, "dues_as_on_amt", CHANGE_TAX_VALUE, "")}
                    {this.getPicker("dues_status", 'Dues Status', ["Paid", "Pending", "Pending with delay"],
                        propertyDetail === null ? "Paid" : propertyDetail.propertyTax.dues_status, CHANGE_PROPERTY_VALUE)}
                    {this.getFormInput('Cheque Bounce', propertyDetail === null ? "" : propertyDetail.propertyTax.cheque_bounce, "cheque_bounce", CHANGE_TAX_VALUE, "")}
                    {this.getFormInput('Rebater %', propertyDetail === null ? "" : propertyDetail.propertyTax.rebate_percent_5, "rebate_percent_5", CHANGE_TAX_VALUE, "")}

                    <ImageSelectView property={propertyDetail} />

                    {this.getTitle('Location Details')}
                    {this.getLocationDetail()}
                    {this.showLocOnMap()}
                    {this.showSaveProgress()}

                    {this.saveDetails()}

                    <CardSection>
                        <Button onPress={() => this.saveProperty()}>Save</Button>
                    </CardSection>

                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    titleText: {
        fontSize: 18,
        color: '#1F85DE'
    }
});

const mapStateToProps = (state) => {
    return {
        propertyDetail: state.prop.propertyDetail,
        changedValue: state.prop.changedValue,
        saveInit: state.prop.saveInit,
        sellatitude: state.prop.sellatitude,
        sellongitude: state.prop.sellongitude,
        allow_save: state.prop.allow_save,
        saving_details: state.prop.saving_details,
        details_saved: state.prop.details_saved,
        imgArr: state.prop.imgArr,
        new_cap_location: state.prop.new_cap_location
    }
}

export default connect(mapStateToProps, {
    addProperty, changePropValue, changeTaxValue,
    saveInitiated, setSelMarker, saveDetail, addPropertyMarker,
    updatePropertyMarker, resetValues, changeLocValue, changeNewLocValue
})(PropertyDetail);
// export default PropertyDetail;