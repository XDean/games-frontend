import {createMuiTheme} from "@material-ui/core";
import {MsOverflowStyleProperty} from "csstype";

export const AppTheme = {
    ...createMuiTheme({
        zIndex: {},
        props: {
            MuiToolbar: {
                variant: 'dense',
            },
        },
        overrides: {
            MuiChip: {
                root: {
                    color: "inherit",
                },
                outlined:{
                    borderColor: "inherit",
                }
            }
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