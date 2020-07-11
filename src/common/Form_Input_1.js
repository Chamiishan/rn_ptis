import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

const Form_Input_1 = ({ error, label, value, onChangeText, autoCorrect, placeHolder, secureTextEntry }) => {

    const { inputStyle, textStyle, containerStyle } = styles;

    return (
        <View style={containerStyle}>
            <Text style={textStyle}>{label}</Text>

            <View style={styles.inputContaianer}>
                <View>
                    <TextInput
                        secureTextEntry={secureTextEntry}
                        placeholder={placeHolder}
                        autoCorrect={autoCorrect} style={inputStyle} value={`${value}`} onChangeText={onChangeText}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create(
    {
        inputContaianer: {
            width: null,
            flex: 0.7,
            marginBottom: 5,
        },
        inputStyle: {
            color: '#000',
            fontSize: 14,
            backgroundColor: '#fff',
            elevation: 2,
            height: 40
        },
        textStyle: {
            color: '#000',
            fontSize: 14,
            flex: 0.3,
            paddingRight: 5,
            paddingLeft: 5
        },
        errorText: {
            color: 'red',
            backgroundColor: 'white',
            textAlign: "right",
            padding: 1
        },
        containerStyle: {
            flex: 1,
            flexDirection: 'row',
            alignItems: "center",
            borderBottomColor: '#dedede',
            borderBottomWidth: 1
        }
    }
);

export { Form_Input_1 }