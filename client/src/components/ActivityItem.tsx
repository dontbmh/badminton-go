import React from "react";
import moment from "moment";
import * as _ from 'lodash'
import { Button, Icon, Label } from "semantic-ui-react";
import { Activity, User } from "../model";
import { auth } from "../service";

interface IProps {
    handleAction?: ({ id, act: string }) => void;
    context: Activity;
}

class ActivityItem extends React.Component<IProps> {

    render() {
        const { handleAction, context } = this.props;
        const start = moment(context.startTime * 1000)
        const end = moment(context.endTime * 1000)
        const duration = moment.duration(end.diff(start)).asHours();
        let title = `${start.format('YYYY-MM-DD')} - ${context.stadium}`;
        if (context.fields) {
            title = `${context.stadium}#${context.fields}`;
        }
        let status = '';
        switch (context.status) {
            case 'active':
                status = 'green';
                break;
            case 'deprecated':
                status = 'red';
                break;
            default:
                status = 'grey'
                break;
        }
        let color: any = 'blue';
        let icon: any = 'heart outline'
        let text = 'Join'
        const joined = _.findIndex(context.attendees, { id: auth.currentUser.id }) > -1;
        const action = () => handleAction({ id: context.id, act: joined ? 'leave' : 'join' })
        if (joined) {
            color = 'red';
            icon = 'heart';
            text = 'Leave';
        }
        return (
            <div class="item">
                <div class="ui small image">
                    <img src="/images/activity.png" />
                </div>
                <div class="content">
                    <a class="header">{title}</a>
                    <div class="meta">
                        <a>{`Initiator: ${context.initiator}`}</a>
                    </div>
                    <div class="meta">
                        <a>{`Commence: ${start.format("HH:mma")}`}</a>
                    </div>
                    <div class="meta">
                        <a>{`Duration: about ${duration.toFixed(1)} hour(s)`}</a>
                    </div>
                    <div class="description">
                        {context.desc}
                    </div>
                    <div class="extra">
                        <div style={{minHeight:'28px'}}>
                            {_.map(context.attendees, (u: User) => (
                            <Label as='a' key={u.id} image pointing='right'>
                                <img src='/images/avatar.png' />
                                {u.name}
                            </Label>))}
                        </div>
                        <div class="ui right floated">
                            <Button as='div' labelPosition='right'>
                                <Button onClick={action} color={color}>
                                    <Icon name={icon} />
                                    {text}
                                </Button>
                                <Label as='a' basic color={color} pointing='left'>
                                    {`${context.currPpl}/${context.maxPpl}`}
                                </Label>
                            </Button>
                        </div>
                        <div class={`ui label ${status}`}>{context.status.toUpperCase()}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ActivityItem;