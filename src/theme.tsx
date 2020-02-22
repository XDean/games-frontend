import {createMuiTheme} from "@material-ui/core";

export const AppTheme = {
    ...createMuiTheme({}),
    ...{
        backdropStyle: {
            zIndex: 99999,
            color: '#fff',
        },
    }
};