import React, {useContext, useEffect, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, CircularProgress, Dialog, Grid, IconButton, ThemeProvider, Tooltip} from "@material-ui/core";
import {AppContext} from "../../App";
import {autoWs} from "../../util/ws";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router";
import {AppTheme} from "../../theme";
import RefreshIcon from '@material-ui/icons/Refresh';
import HomeIcon from '@material-ui/icons/Home';
import Typography from "@material-ui/core/Typography";
import {EmptyTopicSender, SocketTopicSender} from "../common/model/socket";
import {MultiPlayerRole} from "../common/model/multi-player/host";
import {SelectDialog} from "../../components/selectDialog";
import {HSSLTheme} from "./theme";
import banner from "./resources/banner.webp";
import {HSSLMeta} from "./meta";
import {ShareRoom} from "../../components/snippts";
import {grey} from "@material-ui/core/colors";
import HSSLHelpView from "./components/help";
import HSSLCreateView from "./components/create";
import {HSSLGame} from "./model/game";
import HSSLGameView from "./components/game";
import GameCard from "../../board/gameCard";

export const HSSLBoardCard = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    return (
        <React.Fragment>
            <GameCard name={HSSLMeta.name} image={banner}
                      desc={"玩家扮演16世纪时往来于欧亚间的精明商人，通过缜密观察六种不同货物的流行趋势，装运和出售合适的货物来获取最大利益"}
                      onPlay={() => setShowCreate(true)} onHelp={() => setShowHelp(true)}
            />
            {showHelp && <Dialog maxWidth={"md"} fullWidth open onClose={() => setShowHelp(false)}>
                <HSSLHelpView onClose={() => setShowHelp(false)}/>
            </Dialog>}
            {showCreate && <Dialog open onClose={() => setShowCreate(false)}>
                <HSSLCreateView onClose={() => setShowCreate(false)}/>
            </Dialog>}
        </React.Fragment>
    )
};

export const HSSLHeadView = () => {
    const {path} = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/:id`}>
                <ShareRoomIcon/>
            </Route>
        </Switch>
    )
};

export function ShareRoomIcon() {
    const {id} = useParams();
    return <ShareRoom id={id!}/>
}

export const HSSLMainView: React.FunctionComponent<{}> = () => {
    const {path} = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/:id`}>
                <HSSLActualMainView/>
            </Route>
        </Switch>
    )
};

const useMainStyles = makeStyles<typeof AppTheme>((theme) => createStyles({
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

const HSSLActualMainView: React.FunctionComponent<{}> = () => {
    const {id} = useParams();
    const ctx = useContext(AppContext);
    const classes = useMainStyles();
    const history = useHistory();

    const [game, setGame] = useState<HSSLGame>();

    const [connectState, setConnectState] = useState<"open" | "connecting" | "retry" | "error">("connecting");
    const [connectError, setConnectError] = useState<string>();
    const [gameState, setGameState] = useState<MultiPlayerRole>("none");

    useEffect(() => {
        let newGame = new HSSLGame(id!, ctx.id);
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
            <SelectDialog options={[
                <Tooltip title={"房间已满"} open={!canJoin} placement={"right"} arrow>
                    <Box color={canJoin ? undefined : "grey"}>加入游戏</Box>
                </Tooltip>,
                "观看游戏"]} onSelect={(i) => {
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
        <ThemeProvider theme={outer => ({...outer, ...HSSLTheme})}>
            <Box className={classes.root}>
                {game && <HSSLGameView game={game}/>}
                {!(connectState in ["open"]) && connectStateView()}
                {connectState === "open" && gameState === "not-determined" && selectJoinWatch()}
            </Box>
        </ThemeProvider>
    )
};