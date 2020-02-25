import {createMuiTheme} from "@material-ui/core";
import {MsOverflowStyleProperty} from "csstype";

export const AppTheme = {
    ...createMuiTheme({
        props: {
            MuiToolbar: {
                variant: 'dense',
            },
        }
    }),
    ...{
        backdropStyle: {
            zIndex: 99999,
            color: '#fff',
        },
        hideScrollBar: {
            '&::-webkit-scrollbar': {
                width: '0'
            },
            msOverflowStyle: "none" as MsOverflowStyleProperty,
        }
    }
};