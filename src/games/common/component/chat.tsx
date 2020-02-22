import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {InputBase, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles({
    messageBox: {
        overflow: "auto",
        width: "100%",
        height: "100%",
    },
});

export type Message = {
    who: string
    content: string | ReactNode
}

type ChatProp = {
    messages: Message[]
    send: (msg: string) => void
}

const ChatView: React.FunctionComponent<ChatProp> = (props) => {
    const classes = useStyles();
    const msgBoxRef = useRef<Element | undefined>(undefined);
    const [msgToSend, setMsgToSend] = useState("");
    const [lockScroll, setLockScroll] = useState(false);

    useEffect(() => {
        if (lockScroll) {
            let current = msgBoxRef.current;
            current && (current.scrollTop = current.scrollHeight);
        }
    }, [props.messages, lockScroll]);

    return (
        <Paper style={{height: "100%"}} elevation={3}>
            <Paper className={classes.messageBox} style={{maxHeight: 130}} ref={msgBoxRef}>
                <Grid container>
                    {
                        props.messages.map((msg, i) => {
                            return (
                                <Grid item xs={12} key={i}>
                                    {msg.content}
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Paper>
            <Divider/>
            <InputBase placeholder="发送消息"
                       style={{width: "100%"}}
                       value={msgToSend}
                       onChange={e => setMsgToSend(e.target.value)}
                       onKeyPress={(e) => {
                           if (e.key === 'Enter') {
                               props.send(msgToSend);
                               e.preventDefault();
                           }
                       }}/>
        </Paper>
    )
};

export default ChatView;