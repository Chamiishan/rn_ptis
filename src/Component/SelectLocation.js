import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { setSelMarker, fetchLocs, get_in_area_locs, setNewLocValue } from '../actions';
import AddLocationModal from '../Component/AddLocationModal';
import { Actions } from 'react-native-router-flux';

class SelectLocation extends React.Component {

    componentDidMount() {
        console.log("componentDidMount in select location.");
        this.props.fetchLocs();
    }

    onMapReady() {
        this.props.setSelMarker({
            latitude: this.props.sellatitude === 0 ? this.props.latitude : this.props.sellatitude,
            longitude: this.props.sellongitude === 0 ? this.props.longitude : this.props.sellongitude
        });

        // if (this.props.sellongitude) {
        //     this.map.animateToRegion({
        //         latitude: this.props.latitude,
        //         longitude: this.props.longitude,
        //         latitudeDelta: 0.0070,
        //         longitudeDelta: 0.0070
        //     }, 1000);
        // }
    }

    onUserLocChange() {
        if (this.props.sellatitude) {
            this.props.get_in_area_locs({ loc_latitude: this.props.latitude, loc_longitude: this.props.longitude });
        
            this.map.animateToRegion({
                latitude: this.props.latitude,
                longitude: this.props.longitude,
                latitudeDelta: 0.0070,
                longitudeDelta: 0.0070
            }, 1000);
        }
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

    onMarkerSelection(ref, cap_location) {
        // console.log("on marker press: ", ref, " : ", id);
        // Actions.pop({id: id}, timeout: 1);
        this.props.setNewLocValue(cap_location);
        Actions.pop();
        // setTimeout(() => {
        //     Actions.refresh({
        //         new_cap_location: cap_location
        //     })
        // }, 10)
    }

    addMarker() {
        var arr = new Array();
        if (this.props.locations) {
            var index = 0;
            this.props.locations.forEach((marker, key) => {
                // const marker = value[0];
                arr.push(
                    <MapView.Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.loc_latitude, longitude: marker.loc_longitude }}
                        title={(marker.loc_address + ", " + marker.loc_city)}
                        onPress={(ref) => this.onMarkerSelection(ref, marker)}
                    // ref={ref => markerArray[index] = ref}
                    >
                    </MapView.Marker>
                );
                index++;
            })
        }
        if (this.props.sellatitude !== null) {
            console.log("propertyDetail: ", this.props.propertyDetail);
            // arr.push(
            //     <MapView.Marker
            //         key={marker.id}
            //         coordinate={{ latitude: marker.loc_latitude, longitude: marker.loc_longitude }}
            //         title={(marker.loc_address + ", " + marker.loc_city)}
            //         onPress={(ref) => this.onMarkerSelection(ref, marker)}
            //     // ref={ref => markerArray[index] = ref}
            //     >
            //     </MapView.Marker>
            // );
        }
        return arr;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={styles.mapStyle}
                    showsMyLocationButton={true}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    provider={PROVIDER_GOOGLE}
                    onMapReady={() => this.onMapReady()}
                    ref={el => (this.map = el)}
                    onUserLocationChange={() => this.onUserLocChange()}
                >
                    {this.addMarker()}
                </MapView>
                <AddLocationModal sellatitude={this.props.latitude} sellongitude={this.props.longitude} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mapStyle: {
        position: 'absolute',
        top: 5,
        left: 5,
        bottom: 5,
        right: 5,
        height: '100%',
        width: '100%'
    },
});

const mapStateToProps = (state) => {
    return {
        sellatitude: state.prop.propertyDetail.latitude,
        sellongitude: state.prop.propertyDetail.longitude,
        latitude: state.map.latitude,
        longitude: state.map.longitude,
        animate: state.map.animate,
        locations: state.prop.locations,
        fetched_locs: state.prop.fetched_locs
    }
}

export default connect(mapStateToProps, {setSelMarker, fetchLocs, get_in_area_locs, setNewLocValue})(SelectLocation);