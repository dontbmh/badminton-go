import { createMuiTheme } from '@material-ui/core';
import { grey, blue, deepOrange } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: { main: grey[900] },
        secondary: { main: blue[500] },
        error: { main: deepOrange[800] },
        text: {
            primary: grey[50],
            secondary: blue[500]
        }
    },
    typography: {
        fontFamily: '迷你简圆',
        fontSize: 10
    },
    overrides: {
        MuiInputBase: {
            input: {
                '&:-webkit-autofill': {
                    transitionDelay: '9999s',
                    transitionProperty: 'background-color, color',
                    height: '1.1875rem'
                },
            },
        },
    }
});

export default theme;