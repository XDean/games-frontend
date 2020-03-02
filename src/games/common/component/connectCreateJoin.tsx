import React, {useContext, useEffect, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, CircularProgress, Dialog, Grid, IconButton, Tooltip} from "@material-ui/core";
import {useHistory, useParams} from "react-router";
import {AppContext} from "../../../App";
import {MultiPlayerBoard, MultiPlayerRole} from "../model/multi-player/host";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../model/socket";
import {autoWs} from "../../../util/ws";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Typography from "@material-ui/core/Typography";
import {SelectDialog} from "../../../components/selectDialog";
import {AppTheme} from "../../../theme";
import RefreshIcon from '@material-ui/icons/Refresh';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles<typeof AppTheme>((theme) => createStyles({
    errorDialogContent: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(1),
    },
}));

type ConnectCreateJoinProp = {
    url: string
    game: SocketTopicHandler & SocketInit
    host: MultiPlayerBoard
}

const ConnectCreateJoinView: React.FunctionComponent<ConnectCreateJoinProp> = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const [connectState, setConnectState] = useState<"open" | "connecting" | "retry" | "error">("connecting");
    const [connectError, setConnectError] = useState<string>();
    const [gameState, setGameState] = useState<MultiPlayerRole>("none");

    console.log("render", props)
    useEffect(() => {
        console.log("effect", props)
        setGameState(props.host.myRole.value);
        props.host.myRole.addListener((ob, o, n) => {
            setGameState(n);
        });
        let sender: SocketTopicSender = EmptyTopicSender;
        let ws = autoWs({
            rel: props.url,
            oninit: () => {
                sender = {
                    send(topic: string, data: any): void {
                        ws.send(JSON.stringify({
                            topic: topic,
                            payload: data,
                        }))
                    }
                };
                props.game.init(sender);
            },
            onopen: () => {
                setConnectState("open");
            },
            onretry: () => {
                setConnectState("retry");
            },
            onerror: (e) => {
                setConnectState("error");
                setConnectError("无法连接到服务器，请刷新重试")
            },
            onmessage: (e) => {
                let event = JSON.parse(e.data);
                let topic = event.topic;
                let payload = event.payload;

                if (topic === "error") {
                    setConnectState("error");
                    setConnectError(payload);
                    ws.close();
                } else {
                    props.game.handle(topic, payload)
                }
            }
        });
        return function () {
            ws.close()
        };
    }, [props.game]);

    function connectStateView() {
        function connecting(text: string) {
            return (
                <Backdrop open>
                    <CircularProgress color="inherit"/>
                    <Box style={{padding: 10}}>
                        {text}
                    </Box>
                </Backdrop>
            )
        }

        switch (connectState) {
            case "connecting":
                return connecting("正在连接");
            case "retry":
                return connecting("连接断开，正在重连");
            case "error":
                return <Dialog open>
                    <Grid container className={classes.errorDialogContent} justify={"center"}
                          alignItems={"center"}>
                        <Grid item>
                            <Typography variant="h5" className={classes.title}>
                                {connectError}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container justify="space-evenly">
                        <Grid item>
                            <IconButton onClick={() => history.push("/")} title={"回到主页"}>
                                <HomeIcon fontSize={"large"}/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => window.location.reload()} title={"刷新页面"}>
                                <RefreshIcon fontSize={"large"}/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Dialog>
        }
    }

    function selectJoinWatch() {
        let canJoin = !props.host.isFull();
        return (
            <SelectDialog options={[
                <Tooltip title={"房间已满"} open={!canJoin} placement={"right"} arrow>
                    <Box color={canJoin ? undefined : "grey"}>加入游戏</Box>
                </Tooltip>,
                "观看游戏"]} onSelect={(i) => {
                if (i === 0) {
                    if (canJoin) {
                        props.host.joinGame();
                    }
                } else {
                    props.host.watchGame();
                }
            }}/>
        )
    }

    return (
        <React.Fragment>
            {props.game && props.children}
            {!(connectState in ["open"]) && connectStateView()}
            {connectState === "open" && gameState === "not-determined" && selectJoinWatch()}
        </React.Fragment>
    )
};

export default ConnectCreateJoinView;