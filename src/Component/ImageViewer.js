import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

class ImageViewer extends React.Component {

    render() {
        return (
            <View style={styles.containerStyle}>
                <TouchableOpacity onPress={() => Actions.pop()}>
                    <Image style={{ alignSelf: "flex-end", margin: 10 }} source={require('./assets/close.png')} />
                </TouchableOpacity>
                <View style={styles.imgContainer}>
                    <Image style={styles.imgStyle} source={{ uri: this.props.uri }} />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: '#000'
    },
    imgContainer: {
        justifyContent: "center",
        padding: 10
    },
    imgStyle: {
        width: '100%',
        height: '80%'
    }
});

export default ImageViewer;