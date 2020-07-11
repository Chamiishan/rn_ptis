import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// remove PROVIDER_GOOGLE import if not using Google Maps
import React from 'react';
import {
    Text, Image, View, StyleSheet,
    PermissionsAndroid, BackHandler, TouchableOpacity,
    Dimensions, Modal, ActivityIndicator, TextInput
} from 'react-native';
import { connect } from 'react-redux';
import {
    mapChanged, propertySelect, fetchProperty,
    allowAnimate, searchId, allowViewDetails,
    showPropModal, selPropArray
} from '../actions';
import GetLocation from 'react-native-get-location';
import { CardSection } from '../common';
import ViewDetail from '../Component/ViewDetail';
import { Actions } from 'react-native-router-flux';
import BottomUpPanel from '../common/BottomUpPanel';
import PropertyListModal from './PropertyListModal';
import PriceMarker from './PriceMarker';
import { Client } from 'bugsnag-react-native';

// const { scrheight } = Dimensions.get('window');

export async function requestLocationPermission() {
    try {

        if (Platform.OS === 'android') {
            PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
            ).then((result) => {
                if (result['android.permission.ACCESS_COARSE_LOCATION']
                    && result['android.permission.CAMERA']
                    && result['android.permission.READ_CONTACTS']
                    && result['android.permission.ACCESS_FINE_LOCATION']
                    && result['android.permission.READ_EXTERNAL_STORAGE']
                    && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                    //   this.setState({
                    //     permissionsGranted: true
                    //   });
                } else if ((result['android.permission.ACCESS_COARSE_LOCATION'] === 'denied')
                    || (result['android.permission.ACCESS_FINE_LOCATION'] === 'denied')
                    || (result['android.permission.READ_EXTERNAL_STORAGE'] === 'denied')
                    || (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied')) {

                    requestLocationPermission();

                }
            });
        }

    } catch (err) {
        console.warn(err)
    }
}

const screenHeight = Math.round(Dimensions.get('window').height);
// const screenWidth = Math.round(Dimensions.get('window').width);
const markerArray = new Array();

class MyMap extends React.Component {

    constructor(props) {
        super(props);
        this.map = React.createRef();
    }

    onMapReady() {
    }

    UNSAFE_componentWillMount() {
        this.props.fetchProperty();
        this.selectNoProperty();
    }

    selectNoProperty() {
        this.props.propertySelect({
            propertyDetail:
            {
                certificate_no: "--",
                build_no: "--",
                certificate_occupation_date: "--",
                certificate_occupation_type: "-",
                premise_date: "--",
                premise_status: "--",
                build_type: "--",
                build_class: "--",
                build_age: "--",
                build_floor_no: 0,
                build_floor_length_fts: 0,
                build_floor_width_fts: 0,
                build_area_fts: 0,
                build_use: "--",
                pin_code: "--",
                adhar_no: "--",
                gisid: "--",
                latitude: 0,
                longitude: 0,
                propertyTax: {
                    ptin_no: "--",
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
        });
    }

    async componentDidMount() {
        await requestLocationPermission()

        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        BackHandler.exitApp();
    }

    addProperty() {
        const bugsnag = new Client("f54d292ae43cb339ab33745200bbd2ff");
        bugsnag.notify(new Error("Test error"));

        Actions.pdetail();
    }

    showProperty(markerData) {
        this.props.allowViewDetails(true);
        this.props.propertySelect(markerData);
    }

    showPropList(propArray) {
        this.props.showPropModal(!this.props.showhide);
        this.props.selPropArray(propArray);
    }

    updateMap() {

        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {

                const lat = location.latitude;
                const lon = location.longitude;

                this.props.mapChanged({ lat, lon });
                if (this.props.animate) {
                    this.map.animateToRegion({
                        latitude: this.props.latitude,
                        longitude: this.props.longitude,
                        latitudeDelta: 0.0070,
                        longitudeDelta: 0.0070
                    }, 1000);
                }
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })

    }

    getPropImg(marker) {
        // console.log("marker.dues_status: ", marker.propertyTax.dues_status);
        if (marker.propertyTax.dues_status === 'Pending with delay') {
            return require('./assets/home_pend_delayed.png');
        } else if (marker.propertyTax.dues_status === "Pending") {
            return require('./assets/home_pend.png');
        } else {
            return require('./assets/home_paid.png');
        }
    }

    // getItem(item) {
    //     console.log("getItem");

    //     return (
    //         <TouchableOpacity style={styles.item} onPress={() => { this.props.showPropModal(!this.props.showhide) }}>
    //             <Image source={this.getPropImg(item.propertyTax.dues_status)} />
    //             <Text style={styles.title}> ID: {item.gisid}, DUES: {item.propertyTax.dues_status}</Text>
    //         </TouchableOpacity>
    //     );
    // }

    addMarkers() {

        if (this.props.locations) {
            // return (
            var arr = new Array();
            var index = 0;
            this.props.locations.forEach((value, key) => {
                const marker = value[0];
                // return (
                arr.push(
                    <Marker
                        key = {marker.gisid}
                        coordinate={{
                            latitude: marker.cap_location.loc_latitude,
                            longitude: marker.cap_location.loc_longitude
                        }}
                        title={("ID:" + marker.gisid + "; DUES:" + marker.propertyTax.dues_status)}
                        onPress={value.length == 1 ? this.showProperty.bind(this, { "propertyDetail": marker }) :
                            this.showPropList.bind(this, { value })
                        }
                        ref={ref => markerArray[index] = ref}
                    >
                        <View style={{
                            position: 'absolute',
                            backgroundColor: 'blue',
                            alignItems: 'center',
                            borderRadius: 5
                        }}>
                            <PriceMarker amount={value.length} />
                            {/* <Text style={{ fontSize: 30, color:'white' }}>{value.length}</Text>
                            <Image source={value.length > 1 ? require('./assets/home_paid.png') : this.getPropImg(marker)} /> */}
                        </View>
                    </Marker>
                    // )
                );
                index++;
            })
            return arr;
            // );
        }
    }

    recenter() {
        if (!this.props.animate) {
            return (
                <TouchableOpacity
                    style={
                        styles.recenterTouch
                    }
                    onPress={
                        () => this.props.allowAnimate(true)
                    }
                >
                    <Text style={styles.recenterText}>Recenter</Text>
                </TouchableOpacity>
            );
        }
    }

    getSearchStyle() {
        if (this.props.panelStatus) {
            return (styles.simpleSearchStyle);
        } else {
            return (styles.searchStyleElevated);
        }
    }

    getItemData(text) {
        this.props.searchId(text);
    }

    onMarkerSelected(marker) {
        this.props.allowViewDetails(true);
        this.props.searchId('');
        markerArray.map(selected_marker => {
            if (selected_marker !== null && selected_marker.props.title === marker.gisid) {
                selected_marker.showCallout();
            }
        })
        this.props.propertySelect({ "propertyDetail": marker });
        this.props.allowAnimate(false);
        this.map.animateToRegion({
            latitude: marker.latitude,
            longitude: marker.longitude,
            latitudeDelta: 0.0070,
            longitudeDelta: 0.0070
        }, 1000);
    }

    getSearchItems() {

        return (
            <View style={styles.sListContainer}>
                {this.props.searchedItems.map(marker =>
                    <TouchableOpacity
                        onPress={() => this.onMarkerSelected(marker)}>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemtitle}>{marker.gisid}</Text>
                        </View>
                    </TouchableOpacity>
                )
                }
            </View>
        )
    }

    showFetchProgress() {

        if (this.props.showFetchProgress) {
            return (
                <Modal
                    transparent={true}
                    formSheet
                    visible={this.props.showFetchProgress}
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

    renderHeader = () =>
        <TouchableOpacity style={{ height: 20, alignSelf: 'center' }} >
            <Image
                style={
                    {
                        backgroundColor: 'white',
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                    }
                }
                source={this.props.panelStatus ? require('./assets/down_arrow.png') : require('./assets/up_arrow.png')}
            />
        </TouchableOpacity>

    renderBottomUpPanelContent = () =>
        <View style={
            styles.sliderStyle
        }>
            <CardSection>
                <ViewDetail></ViewDetail>
            </CardSection>
        </View>

    getBtmPanel() {
        if (this.props.allowDrag) {
            return (
                <BottomUpPanel
                    childRef={ref => { this.panel = ref }}
                    content={() =>
                        <View style={
                            styles.sliderStyle
                        }>
                            <CardSection>
                                <ViewDetail panel={this.panel}></ViewDetail>
                            </CardSection>
                        </View>
                    }
                    // icon={this.renderBottomUpPanelIcon}
                    topEnd={screenHeight - screenHeight * 0.8}
                    startHeight={80}
                    iconview={this.renderHeader}
                    bottomUpSlideBtn={{
                        display: 'flex',
                        alignSelf: 'flex-start',
                        backgroundColor: 'white',
                        alignItems: 'center'
                    }}>

                </BottomUpPanel>
            );
        } else {
            return null;
        }
    }

    render() {

        return (
            <View style={{
                flex: 1
            }}>
                <MapView
                    onPanDrag={() => this.props.allowAnimate(false)}
                    onPress={() => this.props.allowViewDetails(false)}
                    showsUserLocation
                    onUserLocationChange={() => this.updateMap()}
                    provider={PROVIDER_GOOGLE}
                    ref={
                        el => (this.map = el)
                    }
                    style={
                        styles.mapStyle
                    }
                >
                    {this.addMarkers()}
                </MapView>

                <TextInput
                    style={this.getSearchStyle()}
                    ref="searchBar"
                    placeholder="Search"
                    autoFocus={false}
                    onChangeText={(text) => this.getItemData(text)}
                />

                {this.getSearchItems()}

                <TouchableOpacity
                    style={
                        styles.touchStyle
                    }
                    onPress={
                        () => this.addProperty()
                    }
                >
                    <Image
                        style={
                            styles.imgStyle
                        }
                        source={
                            require('./assets/add.png')
                        }
                    />
                </TouchableOpacity>
                {this.recenter()}
                {this.showFetchProgress()}
                {this.getBtmPanel()}
                <PropertyListModal />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%'
    },
    touchStyle: {
        position: 'absolute',
        height: 50,
        width: 50,
        left: 10,
        top: 100
    },
    imgStyle: {
        width: 60,
        height: 60,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    sliderStyle: {
        backgroundColor: '#fff',
        elevation: 5
    },
    recenterTouch: {
        position: 'absolute',
        right: 10,
        bottom: 100,
        fontSize: 14,
        backgroundColor: '#007aaf',
        alignItems: 'center',
        borderRadius: 5,
    },
    recenterText: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        color: '#fff'
    },
    simpleSearchStyle: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: '90%',
        height: 50,
        paddingLeft: 10,
        top: 10,
        alignSelf: "center",
        borderRadius: 10
    },
    searchStyleElevated: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: '90%',
        height: 50,
        elevation: 2,
        paddingLeft: 10,
        top: 10,
        alignSelf: "center",
        borderRadius: 10
    },
    sListContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 65,
        elevation: 1
    },
    listItem: {
        backgroundColor: '#fff',
        padding: 5,
        marginVertical: 1,
        borderWidth: 0.5,
        borderBottomColor: '#000',
        marginHorizontal: 5,
    },
    listItemtitle: {
        fontSize: 20,
        color: '#000'
    },
});

const mapStateToProps = (state) => {
    return {
        latitude: state.map.latitude,
        longitude: state.map.longitude,
        propertyData: state.map.propertyData,
        markersfetch: state.map.markers,
        locations: state.map.locations,
        animate: state.map.animate,
        panelStatus: state.map.panelStatus,
        searchedItems: state.map.searchedItems,
        showFetchProgress: state.map.showFetchProgress,
        allowDrag: state.map.allowDrag,
        showhide: state.map.show_hide
    }
}

export default connect(mapStateToProps, {
    mapChanged, propertySelect, fetchProperty,
    allowAnimate, searchId, allowViewDetails,
    showPropModal, selPropArray
})(MyMap);


        // if (this.props.markersfetch) {
        //     return (
        //         this.props.markersfetch.map((marker, index) => {
        //             return (
        //                 <Marker
        //                     key={marker.gisid}
        //                     coordinate={marker}
        //                     title={("ID:" + marker.gisid + "; DUES:" + marker.propertyTax.dues_status)}
        //                     onPress={
        //                         this.showProperty.bind(this, { "propertyDetail": marker })
        //                     }
        //                     image={
        //                         this.getMarkerImg(marker)
        //                     }
        //                     ref={
        //                         ref => markerArray[index] = ref
        //                     }
        //                 />
        //             );
        //         }
        //         )
        //     );
        // }

    // getListItem(marker) {
    //     return (
    //         <TouchableOpacity
    //             onPress={() => this.onMarkerSelected(marker)}
    //         >
    //             <View style={styles.listItem}>
    //                 <Text style={styles.listItemtitle}>{marker.gisid}</Text>
    //             </View>
    //         </TouchableOpacity>
    //     );
    // }