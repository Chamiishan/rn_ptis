import React from 'react';
import { Modal, Text, View } from 'react-native';
import { CardSection } from './CardSection';
import { Button } from './Button';

const Confirm = ({ children, onAccept, onDecline, visible }) => {

    const { containerStyle, textStyle, cardSectionStyle } = styles;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={() => { }}
        >
            <View style={containerStyle}>
                <CardSection style={cardSectionStyle}>
                    <Text style={textStyle}>
                        {children}
                    </Text>
                </CardSection>

                <CardSection>
                    <Button onPress={onAccept}>
                        Yes
                    </Button>
                    <Button onPress={onDecline}>
                        No
                    </Button>
                </CardSection>
            </View>
        </Modal>
    );
}

const styles = {
    cardSectionStyle: {
        justifyContent: 'center'
    },

    textStyle: {
        justifyContent: 'center',
        fontSize: 18,
        textAlign: 'center',
        flex: 1
    },

    containerStyle: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
        position: 'relative'
    }
}

export { Confirm }