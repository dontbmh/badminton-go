import React from 'react'
import {
    Button, Form, Grid, Header,
    Image, Message, Segment, Modal
} from 'semantic-ui-react'
import { auth, http } from '../service';
import persist from '../service/persist';
import { User } from '../model';
import moment from 'moment';

class Login extends React.Component<{ history: any }> {

    state = { error: '', name: '', bio: '' };

    handleNameChange = (e) => {
        this.setState({ name: e.target.value });
    }

    handleBioChange = (e) => {
        this.setState({ bio: e.target.value });
    }

    handleAction = () => {
        this.setState({ error: '' });
    }

    handleEnterClick = async () => {
        const { name, bio } = this.state;
        if (name) {
            if (await auth.login({ name, bio })) {
                persist.save('user', auth.currentUser);
                this.props.history.push('/home');
            } else {
                this.setState({ error: 'fail to login' });
            }
        }
    }

    componentDidMount() {
        try {
            const user = persist.load('user', User);
            if (user) {
                const expire = user.time + 24 * 60 * 60;
                if (moment().unix() > expire) {
                    persist.delete('user');
                } else {
                    http.token = user.id;
                    auth.currentUser = user;
                    auth.isAuthenticated = true;
                    this.props.history.push('/home');
                }
            }
        } catch (e) {
            console.error('fail to load persistent data')
        }
    }

    render() {
        const { error } = this.state;

        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='/logo.png' /> Begin with your name
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input required fluid icon='user' iconPosition='left' placeholder='Name'
                                onChange={this.handleNameChange} />
                            <Form.Input fluid icon='pencil' iconPosition='left' placeholder='Biography'
                                onChange={this.handleBioChange} />
                            <Button color='teal' fluid size='large' onClick={this.handleEnterClick}>Enter</Button>
                        </Segment>
                    </Form>
                    <Message>
                        New to us? <a href='#'>See what we do</a>
                    </Message>
                </Grid.Column>
                <Modal
                    size='mini'
                    open={!!error}
                    header='Error'
                    content={error}
                    onActionClick={this.handleAction}
                    actions={[{ key: 'ok', content: 'OK', positive: true }]}
                />
            </Grid>
        );
    }
}

export default Login
