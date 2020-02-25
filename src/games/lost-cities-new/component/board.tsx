import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Button, Grid, Tooltip} from "@material-ui/core";
import LCHandView from "./hand";
import {createCards, LCCard, LCCards} from "../model/card";
import {LCTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {DrawType, LCGame, PlayType} from "../model/board";
import {SocketTopicSender} from "../../common/model/socket";
import LCColorBoardView from "./color-board";
import {AppTheme} from "../../../theme";
import {useStateByProp} from "../../../util/property";
import LoopIcon from '@material-ui/icons/Loop';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DoneIcon from '@material-ui/icons/Done';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles<typeof AppTheme>(theme => createStyles({
    root: {
        height: "100%",
        padding: theme.spacing(4),
        maxWidth: 1200,
        margin: "auto",
    },
    chat: {
        height: 180,
        position: "relative",
        padding: theme.spacing(1),
    },
    otherHand: {
        padding: theme.spacing(1),
    },
    myHand: {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(3),
    },
    handBar: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    button: {
        minWidth: 0,
    },
}));

type Operation = "selectCard" | "selectPlayType" | "selectDraw" | "submit" | "idle";

enum HandSort {
    NULL = 0,
    COLOR,
    POINT
}

type LCBoardProp = {
    game: LCGame
    sender: SocketTopicSender
}

const LCBoardView: React.FunctionComponent<LCBoardProp> = (props) => {
    const classes = useStyles();
    const role = useStateByProp(props.game.host.myRole, "none")[0];
    const playing = useStateByProp(props.game.host.playing, false)[0];
    const mySeat = useStateByProp(props.game.host.mySeat, 0)[0];
    const hand = useStateByProp(props.game.board.hand, [[], []])[0][mySeat];
    const current = useStateByProp(props.game.board.current, 0)[0];

    let [playCard, setPlayCard] = useState<LCCard>();
    let [playType, setPlayType] = useState<PlayType>();
    let [drawType, setDrawType] = useState<DrawType>();

    const [sort, setSort] = useState<HandSort>(HandSort.NULL);
    const [sortedHand, setSortedHand] = useState<LCCards>(hand);
    useEffect(() => {
        setSortedHand(hand.slice().sort((a, b) => {
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
        }));
    }, [hand, sort]);

    const isMyTurn = current === props.game.host.mySeat.value;
    const op: Operation = function () {
        if (!isMyTurn) {
            return "idle";
        } else if (playCard === undefined) {
            return "selectCard";
        } else if (playType === undefined) {
            return "selectPlayType";
        } else if (drawType === undefined) {
            return "selectDraw";
        } else {
            return "submit";
        }
    }();
    console.log(op)

    function onSort() {
        setSort((sort + 1) % 3);
    }

    function onSelectPlayCard(card: LCCard) {
        setPlayCard(playCard === card ? undefined : card);
    }

    function onSelectPlayType(type: PlayType) {
        setPlayType(playType === type ? undefined : type);
    }

    function onSelectDrawType(type: DrawType) {
        setDrawType(drawType === type ? undefined : type);
    }

    const canSubmit = isMyTurn && playCard && playType && drawType !== undefined;

    function submit() {
        props.game.submitPlay(playCard!, playType!, drawType!);
        setPlayCard(undefined);
        setPlayType(undefined);
        setDrawType(undefined);
    }

    return (
        <ThemeProvider theme={outer => ({...outer, ...LCTheme})}>
            <Grid container className={classes.root} justify={"center"} alignItems={"center"}>
                <Grid item xs={5} className={classes.otherHand}>
                    <LCHandView cards={createCards(8)} unknown/>
                </Grid>
                <Grid item xs={5}>
                    <LCHandView cards={createCards(8)} unknown/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={0} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={1} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={2} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={3} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={4} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={5} className={classes.chat}>
                    <ChatView controller={props.game.plugins.chat} sender={props.sender}/>
                </Grid>
                <Grid item xs={5} container className={classes.myHand} wrap={"nowrap"} alignItems={"center"}>
                    <Tooltip title={"选择卡牌"} open={op === "selectCard"} arrow>
                        <Grid>
                            <LCHandView cards={sortedHand} selected={playCard}
                                        onClick={onSelectPlayCard}/>
                        </Grid>
                    </Tooltip>
                    <Grid item className={classes.handBar}>
                        <Tooltip title={op === "selectPlayType" ? "选择出牌方式" : (op === "submit" ? "点击确认操作" : "")} open
                                 arrow style={{marginLeft: 15}}>
                            <Grid container direction={"column"}>
                                <Grid item>
                                    <Tooltip title={"排序"} placement={"right"} arrow>
                                        <div style={{float: "left"}}>
                                            <Button onClick={onSort} className={classes.button}>
                                                <LoopIcon/>
                                            </Button>
                                        </div>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={"出牌"} placement={"right"} arrow>
                                        <div style={{float: "left"}}>
                                            <Button disabled={!isMyTurn}
                                                    className={`${classes.button} ${playType === "play" && classes.selectedItem}`}
                                                    onClick={() => onSelectPlayType("play")}>
                                                <SendIcon/>
                                            </Button>
                                        </div>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={"弃牌"} placement={"right"} arrow>
                                        <div style={{float: "left"}}>
                                            <Button disabled={!isMyTurn}
                                                    className={`${classes.button} ${playType === "drop" && classes.selectedItem}`}
                                                    onClick={() => onSelectPlayType("drop")}>
                                                <CancelOutlinedIcon/>
                                            </Button>
                                        </div>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={"确认回合"} placement={"right"} arrow>
                                        <div style={{float: "left"}}>
                                            <Button
                                                disabled={!canSubmit}
                                                className={classes.button}
                                                onClick={() => submit()}>
                                                <DoneIcon/>
                                            </Button>
                                        </div>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
};

export default LCBoardView;