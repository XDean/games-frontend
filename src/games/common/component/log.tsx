import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {useStateByProp} from "../../../util/property";
import {LogPlugin} from "../model/log";

const useStyles = makeStyles({
    container: {
        overflow: "auto",
    },
});

type LogProp<T> = {
    model: LogPlugin<T>
    handle: (t: T) => ReactNode | string | null
}

const LogView: React.FunctionComponent<LogProp<any>> = <T, >(props: LogProp<T>) => {
    const classes = useStyles();
    const msgBoxRef = useRef<Element>();

    const [lockScroll, setLockScroll] = useState(true);
    const messages = useStateByProp(props.model.messages);

    useEffect(() => {
        if (lockScroll) {
            let current = msgBoxRef.current;
            current && (current.scrollTop = current.scrollHeight);
        }
    }, [lockScroll, messages]);

    return (
        <Paper className={classes.container} ref={msgBoxRef} elevation={3}>
            <Grid container>
                {
                    messages.map((msg, i) => {
                        const node = props.handle(msg);
                        return node === null ? null : (
                            <Grid item xs={12} key={i}>
                                {node}
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Paper>
    )
};

export default LogView;