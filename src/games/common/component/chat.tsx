import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {InputBase, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import {SocketTopicSender} from "../model/socket";
import {ChatController, ChatMessage} from "../model/chat";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles({
    messageBox: {
        overflow: "auto",
        width: "100%",
        height: "100%",
    },
});

type ChatProp = {
    controller: ChatController
    sender: SocketTopicSender
    messageViewer?: (msg: any) => ReactNode
}

const ChatView: React.FunctionComponent<ChatProp> = (props) => {
    const classes = useStyles();
    const msgBoxRef = useRef<Element>();
    const inputRef = useRef<HTMLInputElement>();

    const [lockScroll, setLockScroll] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    useEffect(() => {
        setMessages(props.controller.messages.value);
        props.controller.messages.addListener((ob, o, n) => {
            setMessages(n.slice());
        });
    }, [props.controller]);

    useEffect(() => {
        if (lockScroll) {
            let current = msgBoxRef.current;
            current && (current.scrollTop = current.scrollHeight);
        }
    }, [lockScroll]);

    function simpleMessage(msg: ChatMessage) {
        return (
            <Typography>
                [{msg.who}]: {msg.content}
            </Typography>
        )
    }

    return (
        <Paper style={{height: "100%"}} elevation={3}>
            <Paper className={classes.messageBox} ref={msgBoxRef} variant={"outlined"}>
                <Grid container>
                    {
                        messages.map((msg, i) => {
                            return (
                                <Grid item xs={12} key={i}>
                                    {(props.messageViewer&&props.messageViewer(msg.content)) || simpleMessage(msg)}
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Paper>
            <Divider/>
            <InputBase placeholder="发送消息"
                       inputRef={inputRef}
                       style={{width: "100%"}}
                       onKeyPress={(e) => {
                           if (e.key === 'Enter' && inputRef.current) {
                               props.sender.send("chat", inputRef.current.value);
                               inputRef.current.value = "";
                               e.preventDefault();
                           }
                       }}/>
        </Paper>
    )
};

export default ChatView;