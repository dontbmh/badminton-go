import { connect } from 'react-redux';
import {
    addNotification,
    updateNotification,
    removeNotification,
    removeNotifications
} from 'reapop';

const stateToProps = (state: any) => ({

});

const dispatchToProps = {
    addNotification,
    updateNotification,
    removeNotification,
    removeNotifications
};

export default (): any => connect(stateToProps, dispatchToProps);