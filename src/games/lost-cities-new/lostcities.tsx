import React, {useContext, useEffect, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, CircularProgress, Dialog, Grid, IconButton, ThemeProvider} from "@material-ui/core";
import LCGameView from "./component/game";
import {AppContext} from "../../App";
import {autoWs} from "../../util/ws";
import {LCGame} from "./model/board";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {useHistory, useParams} from "react-router";
import {AppTheme} from "../../theme";
import RefreshIcon from '@material-ui/icons/Refresh';
import HomeIcon from '@material-ui/icons/Home';
import Typography from "@material-ui/core/Typography";
import {EmptyTopicSender, SocketTopicSender} from "../common/model/socket";
import {MultiPlayerRole} from "../common/model/multi-player/host";
import {SelectDialog} from "../../components/selectDialog";
import {LCTheme} from "./theme";

const useStyles = makeStyles<typeof AppTheme>((theme) => createStyles({
    root: {
        height: "100%",
    },
    errorDialogContent: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(1),
    },
}));

type LCMainProp = {}

const LCMainView: React.FunctionComponent<LCMainProp> = (props) => {
    const {id} = useParams();
    const ctx = useContext(AppContext);
    const classes = useStyles();
    const history = useHistory();

    const [game, setGame] = useState<LCGame>();

    const [connectState, setConnectState] = useState<"open" | "connecting" | "retry" | "error">("connecting");
    const [connectError, setConnectError] = useState<string>();
    const [gameState, setGameState] = useState<MultiPlayerRole>("none");

    useEffect(() => {
        let newGame = new LCGame(id!, ctx.id);
        setGameState(newGame.host.myRole.value);
        newGame.host.myRole.addListener((ob, o, n) => {
            setGameState(n);
        });
        let sender: SocketTopicSender = EmptyTopicSender;
        let ws = autoWs({
            rel: `socket/game/lostcities/${id}?user=${ctx.id}`,
            oninit: () => {
                sender = {
                    send(topic: string, data: any): void {
                        ws.send(JSON.stringify({
                            topic: topic,
                            payload: data,
                        }))
                    }
                };
                newGame.init(sender);
                setGame(newGame);
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
                    newGame.handle(topic, payload)
                }
            }
        });
        return function () {
            ws.close()
        };
    }, [id, ctx.id]);

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
        let canJoin = !game!.host.isFull();
        return (
            <SelectDialog options={["加入游戏", "观看游戏"]} onSelect={(i) => {
                if (i === 0) {
                    if (canJoin) {
                        game!.host.joinGame();
                    }
                } else {
                    game!.host.watchGame();
                }
            }}/>
        )
    }

    return (
        <ThemeProvider theme={outer => ({...outer, ...LCTheme})}>
            <Box className={classes.root}>
                {game && <LCGameView game={game}/>}
                {!(connectState in ["open"]) && connectStateView()}
                {connectState === "open" && gameState === "not-determined" && selectJoinWatch()}
            </Box>
        </ThemeProvider>
    )
};

export default LCMainView;