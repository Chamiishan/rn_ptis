import React from 'react';
import { View, Picker, StyleSheet, Text } from 'react-native';


class AppPicker extends React.Component {

    getPickerItem(picker_items) {
        return (
            picker_items.map((value) =>
                <Picker.Item key={0} label={value} value={value}></Picker.Item>
            )
        );
    }

    render() {
        const { label, picker_items, onChangeText, value } = this.props
        const { inputStyle, textStyle, containerStyle } = styles;

        return (
            <View style={containerStyle}>
                <Text style={textStyle}>{label}</Text>

                <View style={styles.inputContaianer}>
                    <View>

                        <Picker style={inputStyle}
                            selectedValue={`${value}`}
                            onValueChange={onChangeText} >
                            {this.getPickerItem(picker_items)}
                        </Picker>
                    </View>
                </View>
            </View>
        );
    }

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

export { AppPicker }