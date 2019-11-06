import { connect } from 'react-redux';
import { setUser } from '../store/actions';

const stateToProps = (state: any) => ({
    appState: state.app
});

const dispatchToProps = {
    setUser,
};

export default (): any => connect(stateToProps, dispatchToProps);