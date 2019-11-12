import React from "react";
import { Button, Modal } from "semantic-ui-react";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.min.css'
import { Activity, User } from "../model";
import { http } from "../service";
import moment from "moment";

interface IProps {
    open: boolean;
    user: User;
    onClose?: (save: boolean) => void;
}

class ActivityDetail extends React.Component<IProps> {

    state = { error: '', context: new Activity() };

    handleStadium = (e: any) => {
        const { context } = this.state;
        context.stadium = e.target.value;
        this.setState({ context });
    }

    handleFields = (e: any) => {
        const { context } = this.state;
        context.fields = e.target.value;
        this.setState({ context });
    }

    handleCosts = (e: any) => {
        const { context } = this.state;
        context.costs = parseInt(e.target.value);
        this.setState({ context });
    }

    handleStartTime = (dt: Date) => {
        const { context } = this.state;
        const m = moment(dt);
        context.startTime = m.unix();
        context.endTime = m.add(1, 'hours').unix();
        this.setState({ context });
    }

    handleEndTime = (dt: Date) => {
        const { context } = this.state;
        context.endTime = moment(dt).unix();
        this.setState({ context });
    }

    handleMaxPpl = (e: any) => {
        const { context } = this.state;
        context.maxPpl = parseInt(e.target.value);
        this.setState({ context });
    }

    handleDesc = (e: any) => {
        const { context } = this.state;
        context.desc = e.target.value;
        this.setState({ context });
    }

    handleAction = () => {
        this.setState({ error: '' });
    }

    handleCancel = () => {
        this.setState({ open: false });
        if (this.props.onClose) {
            this.props.onClose(false);
        }
    }

    handleSave = async () => {
        const { context } = this.state;
        let error = '';
        if (!context.stadium) {
            error = 'Stadium cannot be empty';
        } else if (context.maxPpl < 2) {
            error = 'Invalid Max Number of People';
        } else if (context.startTime < new Date().getTime() / 1000 || context.endTime < context.startTime) {
            error = 'Invalid time period';
        }
        if (!error) {
            const resp = await http.post('/activity/new', context, Activity);
            if (!resp) { error = 'Fail to create activity'; }
        }
        if (error) {
            this.setState({ error });
        } else {
            this.setState({ open: false });
            if (this.props.onClose) {
                this.props.onClose(true);
            }
        }
    }

    componentDidUpdate(prev: IProps) {
        if (this.props.open && prev.open !== this.props.open) {
            const context = new Activity();
            context.costs = 0;
            context.maxPpl = 8;
            const start = moment().add(1, 'days')
                .startOf('day')
                .add(18, 'hours')
                .add(30, 'minutes');
            context.startTime = start.unix();
            context.endTime = start.add(1, 'hours').unix();
            this.setState({ context });
        }
    }

    render() {
        const { open } = this.props;
        const { error, context } = this.state;
        return (
            <Modal closeIcon open={open} onClose={this.handleCancel}>
                <Modal.Header>Initialize an activity</Modal.Header>
                <Modal.Content>
                    <div>
                        <div class="ui form segment">
                            <div class="three fields">
                                <div class="required field">
                                    <label>Stadium</label>
                                    <input value={context.stadium} type="text" onChange={this.handleStadium} />
                                </div>
                                <div class="field">
                                    <label>Field(s)</label>
                                    <input value={context.fields} type="text" onChange={this.handleFields} />
                                </div>
                                <div class="field">
                                    <label>Costs</label>
                                    <input value={context.costs} type="number" onChange={this.handleCosts} />
                                </div>
                            </div>
                            <div class="three required fields">
                                <div class="field">
                                    <label>Start Time</label>
                                    <DatePicker
                                        selected={context.startTime * 1000}
                                        onChange={this.handleStartTime}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="yyyy-MM-dd hh:mm aa"
                                    />
                                </div>
                                <div class="field">
                                    <label>End Time</label>
                                    <DatePicker
                                        selected={context.endTime * 1000}
                                        onChange={this.handleEndTime}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="yyyy-MM-dd hh:mm aa"
                                    />
                                </div>
                                <div class="field">
                                    <label>Max Number of People</label>
                                    <input value={context.maxPpl} type="number" onChange={this.handleMaxPpl} />
                                </div>
                            </div>
                            <div class="field">
                                <label>Addtional Description</label>
                                <textarea value={context.desc} onChange={this.handleDesc}></textarea>
                            </div>
                            <Button.Group>
                                <Button onClick={this.handleCancel}>Cancel</Button>
                                <Button.Or />
                                <Button positive onClick={this.handleSave}>Save</Button>
                            </Button.Group>
                        </div>
                        <Modal
                            size='small'
                            open={!!error}
                            header='Error'
                            content={error}
                            onActionClick={this.handleAction}
                            actions={[{ key: 'ok', content: 'OK', positive: true }]}
                        />
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
}

export default ActivityDetail;