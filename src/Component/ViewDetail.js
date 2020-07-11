import React from 'react';
import {
    StyleSheet, View, Text,
    TouchableOpacity,
    // Image, 
    ScrollView
} from 'react-native';
import { CardSection, Button } from '../common';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { panelOpenStatus } from '../actions';
import { AsyncImage } from '../common/AsyncImage';

class ViewDetail extends React.Component {

    getInfoItem(title, titleDetail) {
        if (this.props.propertyData) {

            return (
                <CardSection>
                    <View style={{
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: "row",
                        borderBottomColor: '#dedede',
                        borderBottomWidth: 1
                    }} >
                        <Text
                            style={{
                                fontSize: 16,
                                flex: 0.5,
                                flexDirection: 'row'
                            }}
                        >{title}</Text>
                        <Text
                            style={{
                                fontSize: 14,
                                flex: 0.5,
                                flexDirection: 'row'
                            }}
                        >{titleDetail}
                        </Text>
                    </View>
                </CardSection>
            );
        } else {
            return (
                <CardSection>
                    <View>
                        <Text>No Data</Text>
                    </View>
                </CardSection>
            );
        }
    }

    getTitle(title) {
        return (
            <View style={{ padding: 5 }}>
                <Text style={styles.titleText} >{title}</Text>
            </View>
        );
    }

    openClosePanel() {
        if (this.props.allowDrag) {
            if (this.props.panelStatus) {
            } else {
            }
            this.props.panelOpenStatus(!this.props.panelStatus);
        }
    }

    editDetails() {
        this.props.panel.toggle();
        Actions.pdetail(this.props.propertyData.propertyDetail);
    }

    getImageViewsFrmServer() {

        if (this.props.propertyData) {

            const { images } = this.props.propertyData.propertyDetail;

            if (images != null && images.length > 0) {
                const image_names = images.split(",");

                const url = "http://13.235.156.167:1025/loginws/rest/property_detail/fetchPropImage?filename=";
                if (image_names !== null && image_names.length > 0) {
                    return (
                        image_names.map((img, index) => (
                            <TouchableOpacity key={index} onPress={() => Actions.view_image({ uri: (url + img.trim()) })}>
                                <AsyncImage style={styles.downImgStyle} placeholderColor={require('../Component/assets/home_1.png')}
                                    source={{ uri: (url + img.trim()) }} />
                            </TouchableOpacity>
                        ))
                    );
                }
            }
        } else {
            return null;
        }
    }

    render() {

        // certificate_no: "103/525",

        // certificate_occupation_date: "Wednesday, May 16, 2001",
        // certificate_occupation_type: "Rental",
        // premise_date: "Wednesday, May 16, 2001",
        // premise_status: "Yes",
        // adhar_no: "103/525",        
        // latitude: 0,
        // longitude: 0,

        const { gisid, build_no, build_type, build_class, pin_code, address, city, state, country, build_floor_no, build_floor_length_fts, build_floor_width_fts,
            build_area_fts, build_use, build_age, propertyTax
        } = this.props.propertyData.propertyDetail;

        const { ptin_no, arrear_tax, arrear_inter, current_tax, current_inter, tax_total_amt, to_be_paid_amt, paid_amt, dues_as_on_amt,
            dues_status, cheque_bounce, rebate_percent_5 } = propertyTax;


        return (

            <View>
                <View>
                    {/* <TouchableOpacity style={{ height: 40, alignSelf: 'center' }} onPress={() => this.openClosePanel()}>
                        <Image
                            style={
                                styles.imgStyle
                            }
                            source={this.props.panelStatus ? require('./assets/down_arrow.png') : require('./assets/up_arrow.png')}
                        />
                    </TouchableOpacity> */}
                    <View style={{ flex: 1 }}>
                        {/* <ScrollView alwaysBounceVertical={true} bounces={true} scrollEnabled={this.props.panelStatus}> */}
                        {this.getTitle('ID : ' + gisid)}
                        {this.getInfoItem('Building No.', build_no)}
                        {this.getInfoItem('Type', build_type)}
                        {this.getInfoItem('Class', build_class)}
                        {this.getInfoItem('Pin Code', pin_code)}
                        {this.getInfoItem('Address', address)}
                        {this.getInfoItem('City', city)}
                        {this.getInfoItem('State', state)}
                        {this.getInfoItem('Country', country)}

                        {this.getTitle('Floor Details')}
                        {this.getInfoItem('Floor numbers', build_floor_no)}
                        {this.getInfoItem('Floor length', build_floor_length_fts)}
                        {this.getInfoItem('Floor width', build_floor_width_fts)}

                        {this.getTitle('Building Details')}
                        {this.getInfoItem('Building Area', build_area_fts)}
                        {this.getInfoItem('Building Use', build_use)}
                        {this.getInfoItem('Building Age', build_age)}

                        {this.getTitle('Tax Details')}
                        {this.getInfoItem('PTIN No', ptin_no)}
                        {this.getInfoItem('Area Tax', arrear_tax)}
                        {this.getInfoItem('Area Interest', arrear_inter)}
                        {this.getInfoItem('Current Tax', current_tax)}
                        {this.getInfoItem('Current Interest', current_inter)}
                        {this.getInfoItem('Tax total amt.', tax_total_amt)}
                        {this.getInfoItem('To be paid amt.', to_be_paid_amt)}
                        {this.getInfoItem('Paid Amt.', paid_amt)}
                        {this.getInfoItem('Dues Amt.', dues_as_on_amt)}
                        {this.getInfoItem('Dues Status', dues_status)}
                        {this.getInfoItem('Cheque Bounce', cheque_bounce)}
                        {this.getInfoItem('Rebater %', rebate_percent_5)}

                        <View style={styles.imgViewStyle}>
                            {this.getImageViewsFrmServer()}
                        </View>

                        <CardSection>
                            <Button onPress={() => this.editDetails()}>Edit Details</Button>
                        </CardSection>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imgViewStyle: {
        flexDirection: "row",
        alignContent: "space-around",
        flexWrap: "wrap"
    },
    downImgStyle: {
        margin: 8,
        width: 30,
        height: 30
    },
    imgStyle: {
        backgroundColor: 'white',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 18,
        color: '#1F85DE'
    }
});


const mapStateToProps = (state) => {
    return {
        propertyData: state.map.propertyData,
        panelStatus: state.map.panelStatus,
        allowDrag: state.map.allowDrag
    }
}

export default connect(mapStateToProps, { panelOpenStatus })(ViewDetail);