import React from "react";
import _ from 'lodash'
import {
    Container, Header, Menu,
    Icon, Checkbox, Popup, Label, Segment, Button,
} from 'semantic-ui-react'
import ActivityItem from "./ActivityItem";
import { Activity, User } from "../model";
import ActivityDetail from "./ActivityDetail";
import { http, auth } from "../service";
import persist from "../service/persist";

const menuStyle = {
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    marginBottom: '1em',
    marginTop: '1em',
    height: '1em',
    transition: 'box-shadow 0.5s ease, padding 0.5s ease',
}

class Home extends React.Component<{ user: User, history: any }> {

    state = { add: false, active: true, acts: {} };

    handleActiveActs = () => {
        const { active } = this.state;
        this.setState({ active: !active });
        this.refresh();
    }

    handleNewAct = () => {
        this.setState({ add: true });
    }

    handleActClose = (save: boolean) => {
        this.setState({ add: false });
        if (save) { this.refresh(); }
    }

    handleActAction = async ({ id, act }) => {
        const resp = await http.post(`/activity/${id}/${act}`, {}, Activity);
        if (resp.status === 200) {
            const { acts } = this.state;
            acts[id] = resp.data as Activity;
            this.setState({ acts });
        }
    }

    handleLogout = () => {
        http.token = '';
        persist.delete('user');
        this.props.history.push('/');
    }

    async refresh() {
        const { active } = this.state;
        const path = active ? 'active' : 'all';
        const resp = await http.post(`/activity/${path}`, {}, Activity);
        if (resp.status === 200) {
            const as = resp.data as Activity[];
            this.setState({ acts: _.keyBy(as, 'id') });
        }
    }

    componentDidMount() {
        console.log(auth.currentUser);
        this.refresh();
    }

    render() {
        const { user } = this.props;
        const { add, active, acts } = this.state;
        return (
            <div>
                <Container text style={{ marginTop: '2em' }}>
                    <Header as='h1'>Welcome to Activity Center, {user.name}!</Header>
                    <p>
                        Liberally colliborate a game from here
                        </p>
                </Container>
                <Container textAlign='right'>
                    <Label as='a' class="ui mini" prompt basic color='blue'
                        onClick={this.handleLogout}>Logout</Label>
                </Container>
                <Menu
                    borderless
                    style={menuStyle}
                >
                    <Container text>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Popup content='Switch to show only active activities'
                                    trigger={<Checkbox slider label={<label>Active Records</label>}
                                        onChange={this.handleActiveActs} checked={active} />} />
                            </Menu.Item>
                            <Menu.Item onClick={this.handleNewAct}>
                                <Popup content='Create a new activity'
                                    trigger={<div><Icon name='add' />New</div>} />
                            </Menu.Item>
                        </Menu.Menu>
                    </Container>
                </Menu>
                <Container text>
                    <div class="ui relaxed divided items">
                        {_.map(acts, (v: Activity) => (<ActivityItem key={v.id} context={v}
                            handleAction={this.handleActAction} />))}
                    </div>
                </Container>
                <ActivityDetail user={user} open={add} onClose={this.handleActClose} />
            </div>
        )
    }
}

export default Home;