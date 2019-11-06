import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { app, notify } from '../decorators';


@app()
@notify()
class Login extends React.Component {

    public state: any = {
        mode: '',
        loading: false,
        username: '',
        password: '',
        rememberMe: false,
        showPassword: false,
        hasUncompletedTask: false,
        version: ''
    };

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='/logo.png' /> Begin with your name
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input required fluid icon='user' iconPosition='left' placeholder='Name' />
                            <Form.Input fluid icon='pencil' iconPosition='left' placeholder='Status' />
                            <Button color='teal' fluid size='large'>Enter</Button>
                        </Segment>
                    </Form>
                    <Message>
                        New to us? <a href='#'>See what we do</a>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login
