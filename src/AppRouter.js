import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import MyMap from './Component/MyMap';
import PropertyDetail from './Component/PropertyDetail';
import SelectLocation from './Component/SelectLocation';
import ImageViewer from './Component/ImageViewer';
import { connect } from 'react-redux';
import { allowAddLocation } from './actions/PropertyDetailsAction'

// const addLoc = () => {
//     console.log("addLoc");
// }

class AppRouter extends React.Component {

    render() {
        return (
            <Router>
                <Scene key='root'>
                    <Scene key='home' component={MyMap} title="Property Tax Survey" initial></Scene>
                    <Scene key='pdetail' component={PropertyDetail} title="Property Details" >
                    </Scene>
                    <Scene key='showmap' component={SelectLocation} title="Choose Location"
                        rightButtonImage={require('./Component/assets/add_location.png')} onRight={() => this.props.allowAddLocation(true)} ></Scene>
                    <Scene key='view_image' component={ImageViewer} hideNavBar  ></Scene>
                </Scene>
            </Router>
        );
    }
}

// const mapStateToProps = (state) => {
//     return null;
// }

export default connect(null, { allowAddLocation })(AppRouter);