import React, { Component } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View, Image
} from 'react-native';
import { connect } from 'react-redux';
// import { Ionicons } from 'react-native-vector-icons/Ionicons';
// import { Text } from "native-base";
import * as Easing from "react-native/Libraries/Animated/src/Easing";
import { panelOpenStatus } from '../actions';

const { width, height } = Dimensions.get('window');

class BottomUpPanel extends Component {

    static defaultProps = {
        isOpen: false
    };

    // Define state
    state = {
        open: false,
        spinValue: new Animated.Value(0)
    };

    config = {
        position: {
            max: height,
            start: height - this.props.startHeight,
            end: this.props.topEnd,
            min: this.props.topEnd,
            animates: [
                () => this._animatedHeight
            ]
        },
        width: {
            end: width,
            start: width
        },
        height: {
            end: height,
            start: this.props.startHeight
        }

    };

    _animatedHeight = new Animated.Value(this.props.isOpen ? this.config.height.end : this.config.height.start);

    _animatedPosition = new Animated.Value(this.props.isOpen
        ? this.config.position.end
        : this.config.position.start);

    componentDidMount() {
        const { childRef } = this.props;
        childRef(this);

        this._animatedPosition.addListener((value) => {
            //Every time that position changes then actualize the related properties. I.e: height, so the view
            //has the interpolated height
            this.config.position.animates.map(item => {
                item().setValue(value.value);
            })
        });
        // Reset value once listener is registered to update depending animations
        this._animatedPosition.setValue(this._animatedPosition._value);
    }

    componentWillUnmount(){
        const { childRef } = this.props;
        childRef(null);
    }


    // Handle isOpen prop changes to either open or close the window
    componentWillReceiveProps(nextProps) {
        // isOpen prop changed to true from false
        if (!this.props.isOpen && nextProps.isOpen) {
            this.open();
        }
        // isOpen prop changed to false from true
        else if (this.props.isOpen && !nextProps.isOpen) {
            this.close();
        }
    }

    render() {
        const { content } = this.props;

        // Height according to position
        let animatedHeight = this._animatedHeight.interpolate({
            inputRange: [this.config.position.end, this.config.position.start],
            outputRange: [this.config.height.end, this.config.height.start],
        });

        // Icon rotation
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        });
        return (
            <Animated.View style={[styles.buttonUpPanelView, { height: animatedHeight }]}>
                <Animated.View
                    style={[styles.content, {
                        // Add padding at the bottom to fit all content on the screen
                        paddingBottom: this.props.topEnd,
                        width: width,
                        // Animate position on the screen
                        transform: [{ translateY: this._animatedPosition }, { translateX: 0 }]
                    }]}
                >
                    {/*Section for header or button to open the panel*/}
                    <TouchableWithoutFeedback onPress={() => { this.toggle() }}>
                        <Animated.View>
                            <View style={[this.props.bottomUpSlideBtn, { width: width }]}>

                                <TouchableOpacity style={{ height: 40, alignSelf: 'center' }} onPress={() => this.toggle()} >
                                    <Image
                                        style={
                                            {
                                                backgroundColor: 'white',
                                                alignItems: 'flex-end',
                                                justifyContent: 'center'
                                            }
                                        }
                                        source={this.props.panelStatus ? require('../Component/assets/down_arrow.png') : require('../Component/assets/up_arrow.png')}
                                    />
                                </TouchableOpacity>

                                {/* <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                    {this.props.iconview}
                                </Animated.View> */}
                                {/* <Text style={this.props.headerTextStyle}>{this.props.headerText}</Text> */}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>

                    {/* Scrollable content */}
                    <ScrollView
                        ref={(scrollView) => { this._scrollView = scrollView; }}
                        // Enable scrolling only when the window is open
                        scrollEnabled={this.state.open}
                        // Hide all scrolling indicators
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        // Trigger onScroll often
                        scrollEventThrottle={16}
                        onScroll={this._handleScroll}
                    >
                        {/* Render content components */}
                        {content()}
                    </ScrollView>
                </Animated.View>
            </Animated.View>

        );
    }


    open = () => {
        this.setState({ open: true }, () => {
            Animated.timing(this._animatedPosition, {
                toValue: this.config.position.end,
                duration: 600,
            }).start();
            Animated.timing(
                this.state.spinValue,
                {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            ).start()
        });

    };

    close = () => {
        this._scrollView.scrollTo({ y: 0 });
        Animated.timing(this._animatedPosition, {
            toValue: this.config.position.start,
            duration: 600,
        }).start(() => this.setState({
            open: false,
        }));
        Animated.timing(
            this.state.spinValue,
            {
                toValue: 0,
                duration: 600,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();
    };

    toggle = () => {
        if (this.props.allowDrag) {

            if (!this.props.panelStatus) {
                this.open();
            } else {
                this.close();
            }
        }
        this.props.panelOpenStatus(!this.props.panelStatus);
    };

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent'
    },
    content: {
        backgroundColor: 'transparent',
        height: height,
    },
    buttonUpPanelView: {
        position: 'absolute', bottom: 0, width: width, alignItems: 'center', justifyContent: 'flex-end',
        backgroundColor: 'transparent'
    },
});

const mapStateToProps = (state) => {
    return {
        panelStatus: state.map.panelStatus,
        allowDrag: state.map.allowDrag
    }
}

export default connect(mapStateToProps, { panelOpenStatus })(BottomUpPanel);

// export { BottomUpPanel };