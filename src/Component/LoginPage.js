import React from 'react';
import { Card, CardSection, Input, Button } from '../common';

class LoginPage extends React.Component {

    render() {
        return (
            <Card>
                <CardSection>
                    <Input placeHolder="Username" />
                </CardSection>
                <CardSection>
                    <Input placeHolder="Passowrd" />
                </CardSection>
                <CardSection>
                    <Button>Login</Button>
                </CardSection>
                <CardSection>
                    <Button>Close</Button>
                </CardSection>
            </Card>
        );
    }
}

export default LoginPage;