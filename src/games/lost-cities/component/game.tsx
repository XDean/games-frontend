import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Button, Dialog, Grid, Paper, Snackbar, Tooltip, Typography} from "@material-ui/core";
import LCHandView from "./hand";
import {createCards, LCCard, LCCards} from "../model/card";
import {LCTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {LCGame, LCPlayType} from "../model/board";
import LCBoardView from "./board";
import {AppTheme} from "../../../theme";
import {useStateByProp} from "../../../util/property";
import LCDeckView from "./deck";
import LCHelpView from "./help";
import LCScoreBoardView from "./score";
import LogView from "../../common/component/log";
import LCMessageView from "./message";
import {MultiGamePlayer} from "../../common/model/multi-player/host";
import {Alert} from "../../../components/snippts";

const useStyles = makeStyles<typeof AppTheme & typeof LCTheme>(theme => createStyles({
    root: {
        height: "100%",
        margin: "auto",
        position: "relative",
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 1),
        },
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(2, 5),
        },
    },
    logchat: {
        height: "100%",
        width: "70%",
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateColumns: "100%",
        gridTemplateRows: "50% 50%",
        gridRowGap: theme.spacing(1),
    },
    board: {
        height: "100%",
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 1),
        },
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1, 4),
        },
    },
    rightContainer: {
        height: "100%",
        overflow: "auto",
        padding: theme.spacing(0, 1),
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(0),
        },
        [theme.breakpoints.up('lg')]: {
            marginLeft: theme.spacing(4),
        },
    },
    button: {
        minWidth: 0,
        margin: 3,
        padding: "3px 5px"
    },
    myButtonBar: {
        minWidth: "fit-content",
        marginLeft: theme.spacing(1),
    },
    otherButtonBar: {
        minWidth: "fit-content",
        marginLeft: theme.spacing(1),
        marginTop: 20,
    },
    selectedPlayType: {
        boxShadow: theme.selectedShadow,
    },
    infoContainer: {
        marginLeft: theme.spacing(4),
        display: "grid",
        gridTemplateColumns: "1pr",
        justifyItems: "center"
    },
    info: {
        padding: theme.spacing(1, 2),
        margin: theme.spacing(1),
    },
}));

type Operation = "selectCard" | "selectPlayType" | "selectDraw" | "submit" | "idle";

enum HandSort {
    NULL = 0,
    COLOR,
    POINT
}

type LCGameProp = {
    game: LCGame
}

const LCGameView: React.FunctionComponent<LCGameProp> = (props) => {
    const classes = useStyles();
    const role = useStateByProp(props.game.host.myRole);
    const playing = useStateByProp(props.game.host.playing);
    const over = useStateByProp(props.game.board.over);

    const mySeat = useStateByProp(props.game.host.mySeat);
    const otherSeat = 1 - mySeat;

    const hand = useStateByProp(props.game.board.hand);
    const myHand = hand[mySeat];
    const otherHand = hand[otherSeat];

    const player = useStateByProp(props.game.host.players);
    const myPlayer = player[mySeat] || MultiGamePlayer.EMPTY;
    const otherPlayer = player[otherSeat] || MultiGamePlayer.EMPTY;

    const current = useStateByProp(props.game.board.current);

    const playCard = useStateByProp(props.game.playInfo.card);
    const playType = useStateByProp(props.game.playInfo.playType);
    const drawType = useStateByProp(props.game.playInfo.drawType);

    const [sort, setSort] = useState<HandSort>(HandSort.NULL);
    const [sortedMyHand, setSortedMyHand] = useState<LCCards>(myHand);
    const [sortedOtherHand, setSortedOtherHand] = useState<LCCards>(otherHand);

    const [showHelp, setShowHelp] = useState(false);
    const [showScore, setShowScore] = useState(false);

    useEffect(() => {
        function sortHand(hand: LCCards) {
            return hand.slice().sort((a, b) => {
                switch (sort) {
                    case HandSort.NULL:
                        return hand.indexOf(a) - hand.indexOf(b);
                    case HandSort.COLOR:
                        return (a.color - b.color) * 100 + (a.point - b.point);
                    case HandSort.POINT:
                        return (a.point - b.point) * 100 + (a.color - b.color);
                    default:
                        return 0;
                }
            });
        }

        setSortedMyHand(sortHand(myHand));
        setSortedOtherHand(sortHand(otherHand));
        console.log(sortedOtherHand)
    }, [hand, sort]);

    const isMyTurn = current === props.game.host.mySeat.value;
    const isMyPlay = isMyTurn && playing && role === "play";
    const validateMsg = props.game.playInfo.validate();
    const op: Operation = function () {
        if (playCard === "none") {
            return "selectCard";
        } else if (playType === "none") {
            return "selectPlayType";
        } else if (drawType === "none") {
            return "selectDraw";
        } else {
            return "submit";
        }
    }();

    function onSort() {
        setSort((sort + 1) % 3);
    }

    function onSelectPlayCard(card: LCCard) {
        props.game.playInfo.card.value = (playCard === card ? "none" : card);
    }

    function onSelectPlayType(type: LCPlayType) {
        props.game.playInfo.playType.value = (playType === type ? "none" : type);
    }

    function submit() {
        props.game.playInfo.submit();
    }

    return (
        <React.Fragment>
            {validateMsg !== "" &&
            <Snackbar open>
                <Alert severity={"warning"}>
                    {validateMsg}
                </Alert>
            </Snackbar>}
            {showHelp &&
            <Dialog open onClose={() => setShowHelp(false)} style={{zIndex: 9999}}>
                <LCHelpView/>
            </Dialog>}
            {showScore &&
            <Dialog open onClose={() => setShowScore(false)} style={{zIndex: 9999}}>
                <LCScoreBoardView board={props.game.board}/>
            </Dialog>}

            <Grid container wrap={"nowrap"} alignItems={"center"} className={classes.root}>
                <Grid item className={classes.logchat}>
                    <LogView model={props.game.plugins.log}
                             handle={msg => <LCMessageView message={msg} game={props.game}/>}/>
                    <ChatView controller={props.game.plugins.chat}/>
                </Grid>
                <Grid item className={classes.board}>
                    <Tooltip open={isMyPlay && op === "selectDraw"} title={"从弃牌堆抽牌"} arrow
                             placement={"right"}>
                        <LCBoardView game={props.game}/>
                    </Tooltip>
                </Grid>
                <Grid item container className={classes.rightContainer} direction={"column"} justify={"space-between"}
                      wrap={"nowrap"}>
                    <Grid item container wrap={"nowrap"}>
                        <Box>
                            <Typography>
                                {otherPlayer.isEmpty() ? "等待玩家加入" : `${otherPlayer!.id}${otherPlayer.connected ? "" : " (未连接)"}`}
                            </Typography>
                            <LCHandView
                                cards={sortedOtherHand.length === 0 || role === "play" ? createCards(8) : sortedOtherHand}
                                unknown={sortedOtherHand.length === 0 || role === "play"}/>
                        </Box>
                        <Grid container direction={"column"} className={classes.otherButtonBar}>
                            <Grid item>
                                <Button onClick={() => setShowHelp(s => !s)} className={classes.button}
                                        variant={"outlined"}>
                                    <Typography>
                                        帮助
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant={"outlined"} className={classes.button}
                                        onClick={() => setShowScore(s => !s)}>
                                    <Typography>
                                        计分
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems={"center"}>
                        <Tooltip open={isMyPlay && op === "selectDraw"} title={"或从牌库抽牌"} arrow
                                 placement={"bottom"}>
                            <Grid item style={{width: "min-content"}}>
                                <LCDeckView game={props.game}/>
                            </Grid>
                        </Tooltip>
                        <Grid item className={classes.infoContainer}>
                            <Paper elevation={5} className={classes.info}>
                                {function () {
                                    if (playing) {
                                        switch (role) {
                                            case "none":
                                                return "准备数据";
                                            case "not-determined":
                                                return "准备数据";
                                            case "play":
                                                return isMyTurn ? "你的回合" : "对方回合";
                                            case "watch":
                                                return "正在观战 - " + (isMyTurn ? "己方回合" : "对方回合");
                                        }
                                    } else if (over && !myPlayer.ready) {
                                        return "游戏结束";
                                    } else if(!myPlayer.ready){
                                        return "等待所有玩家准备"
                                    } else if (myPlayer.host) {
                                        return myPlayer.ready && otherPlayer.ready ? "所有玩家已就绪" : "等待其他玩家准备";
                                    } else {
                                        return "等待游戏开始";
                                    }
                                }()}
                            </Paper>
                            {!playing && !myPlayer.ready &&
                            <Button onClick={() => props.game.host.ready()} variant={"outlined"}>
                                {over?"再来一局":"点击准备"}
                            </Button>}
                            {!playing && myPlayer.host && myPlayer.ready && otherPlayer.ready &&
                            <Button onClick={() => props.game.host.startGame()} variant={"outlined"}>
                                点击开始游戏
                            </Button>}
                        </Grid>
                    </Grid>
                    <Grid item container wrap={"nowrap"}>
                        <Box>
                            <Tooltip open={isMyPlay && op === "selectCard"} title={"选择手牌"} arrow
                                     placement={"top"}>
                                <LCHandView cards={sortedMyHand.length === 0 ? createCards(8) : sortedMyHand}
                                            unknown={sortedMyHand.length === 0}
                                            selected={playCard === "none" ? undefined : playCard}
                                            onClick={onSelectPlayCard}/>
                            </Tooltip>
                            <Typography>
                                {myPlayer.isEmpty() ? "等待玩家加入" : `${myPlayer!.id}`}
                            </Typography>
                        </Box>
                        <Grid container direction={"column"} className={classes.myButtonBar}>
                            <Grid item>
                                <Button onClick={onSort} className={classes.button} variant={"outlined"}>
                                    <Typography>
                                        排序
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant={"outlined"}
                                        className={`${classes.button} ${playType === "play" ? classes.selectedPlayType : ""}`}
                                        onClick={() => onSelectPlayType("play")}>
                                    <Tooltip
                                        title={"选择出牌或弃牌"}
                                        open={isMyPlay && op === "selectPlayType"}
                                        arrow placement={"right"}>
                                        <Typography>
                                            出牌
                                        </Typography>
                                    </Tooltip>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant={"outlined"}
                                        className={`${classes.button} ${playType === "drop" ? classes.selectedPlayType : ""}`}
                                        onClick={() => onSelectPlayType("drop")}>
                                    <Typography>
                                        弃牌
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    disabled={op !== "submit" || !isMyPlay || validateMsg !== ""}
                                    className={classes.button}
                                    variant={"outlined"}
                                    onClick={() => submit()}>
                                    <Tooltip
                                        title={validateMsg !== "" ? "操作不合法" : (isMyTurn ? "点击确认操作" : "等待对手操作")}
                                        open={isMyPlay && op === "submit"}
                                        arrow placement={"right"}>
                                        <Typography>
                                            确认
                                        </Typography>
                                    </Tooltip>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
};

export default LCGameView;