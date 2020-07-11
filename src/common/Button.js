import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({ onPress, children }) => {

    const { sbutton, sbtnText } = styles;

    return (
        <TouchableOpacity style={sbutton} onPress={onPress}>
            <Text style={sbtnText}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    sbutton: {
        flex: 1,
        alignSelf: 'stretch',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007aaf',
        marginTop: 10,
        marginBottom: 10,
        padding: 5
    },
    sbtnText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#007aaf'
    }
});

export { Button };