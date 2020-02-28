import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {IconButton, InputBase, Paper, PaperProps, Popover} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import {SocketTopicSender} from "../model/socket";
import {ChatPlugin, ChatMessage} from "../model/plugins/chat";
import Typography from "@material-ui/core/Typography";
import SendIcon from '@material-ui/icons/Send';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import {useStateByProp} from "../../../util/property";

const useStyles = makeStyles(theme => createStyles({
    container: {
        display: "flex",
        flexDirection: "column",
    },
    messageBox: {
        overflow: "auto",
        flexGrow: 1,
    },
    inputBar: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        width: "100%"
    },
    iconButton: {
        padding: 3,
    },
    emojiContainer: {
        maxHeight: 200,
        maxWidth: 600,
        overflow: "auto",
    },
    simpleMessage: {
        wordWrap: "break-word",
    }
}));

type ChatProp = {
    controller: ChatPlugin
    messageViewer?: (msg: any) => ReactNode
} & PaperProps

const ChatView: React.FunctionComponent<ChatProp> = (props) => {
    const classes = useStyles();
    const msgBoxRef = useRef<Element>();
    const inputRef = useRef<HTMLInputElement>();

    const [lockScroll, setLockScroll] = useState(true);
    const messages = useStateByProp(props.controller.messages);
    const [emojiPaneAnchor, setEmojiPaneAnchor] = useState();

    useEffect(() => {
        if (lockScroll) {
            let current = msgBoxRef.current;
            current && (current.scrollTop = current.scrollHeight);
        }
    }, [lockScroll, messages]);

    function simpleMessage(msg: ChatMessage) {
        return (
            <React.Fragment>
                <Typography className={classes.simpleMessage} component={"span"}>
                    [{msg.who}]:
                </Typography>
                <Typography className={classes.simpleMessage} component={"span"}>
                    {msg.content}
                </Typography>
            </React.Fragment>
        )
    }

    function send() {
        if (inputRef.current) {
            props.controller.sendMessage(inputRef.current.value);
            inputRef.current.value = "";
        }
    }

    return (
        <Paper {...props} className={`${classes.container} ${props.className}`} elevation={3}>
            <Paper className={classes.messageBox} ref={msgBoxRef} variant={"outlined"}>
                <Grid container>
                    {
                        messages.map((msg, i) => {
                            return (
                                <Grid item xs={12} key={i}>
                                    {(props.messageViewer && props.messageViewer(msg.content)) || simpleMessage(msg)}
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Paper>
            <Divider/>
            <Paper className={classes.inputBar}>
                <InputBase placeholder="发送消息"
                           className={classes.input}
                           inputRef={inputRef}
                           onKeyPress={(e) => {
                               if (e.key === 'Enter') {
                                   send();
                                   e.preventDefault();
                               }
                           }}/>
                <IconButton className={classes.iconButton} onClick={(e) => setEmojiPaneAnchor(e.currentTarget)}>
                    <SentimentVerySatisfiedIcon/>
                </IconButton>
                <IconButton className={classes.iconButton} onClick={send}>
                    <SendIcon/>
                </IconButton>
            </Paper>
            {emojiPaneAnchor && <Popover
                open
                onClose={() => setEmojiPaneAnchor(null)}
                anchorEl={emojiPaneAnchor}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Grid container className={classes.emojiContainer}>
                    {function () {
                        let res = [];
                        for (let i = 56833; i <= 56911; i++) {
                            let char = String.fromCharCode(55357, i);
                            res.push(
                                <Grid item key={i}>
                                    <IconButton size={"small"} color={"inherit"}
                                                onClick={() => inputRef.current!.value += char}>
                                        {char}
                                    </IconButton>
                                </Grid>
                            )
                        }
                        return res;
                    }()
                    }
                </Grid>
            </Popover>
            }
        </Paper>
    )
};

export default ChatView;