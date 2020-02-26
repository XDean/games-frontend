import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Button, Dialog, Grid, Tooltip, Typography} from "@material-ui/core";
import LCHandView from "./hand";
import {createCards, LCCard, LCCards} from "../model/card";
import {LCTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {LCGame, PlayType} from "../model/board";
import LCBoardView from "./board";
import {AppTheme} from "../../../theme";
import {useStateByProp} from "../../../util/property";
import LCDeckView from "./deck";
import LCHelpView from "../../../lost-cities/component/help";
import LCScoreBoardView from "./score";

const useStyles = makeStyles<typeof AppTheme & typeof LCTheme>(theme => createStyles({
    root: {
        height: "100%",
        margin: "auto",
        position: "relative",
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 1),
        },
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1, 10),
        },
    },
    chat: {
        height: "100%",
        minWidth: 200,
        padding: theme.spacing(1),
    },
    board: {
        height: "100%",
        padding: theme.spacing(1, 4),
    },
    rightContainer: {
        height: "100%",
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
        marginLeft: theme.spacing(1),
    },
    otherButtonBar: {
        marginLeft: theme.spacing(1),
        marginTop: 20,
    },
    selectedPlayType: {
        boxShadow: theme.selectedShadow,
    },
//
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
    deck: {
        float: "right",
        paddingRight: theme.spacing(2),
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

    const mySeat = useStateByProp(props.game.host.mySeat);
    const otherSeat = 1 - mySeat;

    const hand = useStateByProp(props.game.board.hand);
    const myHand = hand[mySeat];
    const otherHand = hand[otherSeat];

    const player = useStateByProp(props.game.host.players);
    const myPlayer = player[mySeat];
    const otherPlayer = player[otherSeat];

    const deck = useStateByProp(props.game.board.deck);

    const current = useStateByProp(props.game.board.current);

    const playCard = useStateByProp(props.game.playInfo.card);
    const playType = useStateByProp(props.game.playInfo.playType);
    const drawType = useStateByProp(props.game.playInfo.drawType);

    const [sort, setSort] = useState<HandSort>(HandSort.NULL);
    const [sortedHand, setSortedHand] = useState<LCCards>(myHand);

    const [showHelp, setShowHelp] = useState(false);
    const [showScore, setShowScore] = useState(false);

    useEffect(() => {
        setSortedHand(myHand.slice().sort((a, b) => {
            switch (sort) {
                case HandSort.NULL:
                    return myHand.indexOf(a) - myHand.indexOf(b);
                case HandSort.COLOR:
                    return (a.color - b.color) * 100 + (a.point - b.point);
                case HandSort.POINT:
                    return (a.point - b.point) * 100 + (a.color - b.color);
                default:
                    return 0;
            }
        }));
    }, [myHand, sort]);

    const isMyTurn = current === props.game.host.mySeat.value;
    const op: Operation = function () {
        if (!isMyTurn) {
            return "idle";
        } else if (playCard === "none") {
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

    function onSelectPlayType(type: PlayType) {
        props.game.playInfo.playType.value = (playType === type ? "none" : type);
    }

    function submit() {
        props.game.playInfo.submit();
    }

    return (
        <React.Fragment>
            {showHelp &&
            <Dialog open onClose={() => setShowHelp(false)}>
                <LCHelpView/>
            </Dialog>}
            {showScore &&
            <Dialog open onClose={() => setShowScore(false)}>
                <LCScoreBoardView board={props.game.board}/>
            </Dialog>}
            <Grid container wrap={"nowrap"} alignItems={"center"} className={classes.root}>
                <Grid item className={classes.chat}>
                    <ChatView controller={props.game.plugins.chat}/>
                </Grid>
                <Grid item className={classes.board}>
                    <LCBoardView game={props.game}/>
                </Grid>
                <Grid item container className={classes.rightContainer} direction={"column"} justify={"space-between"}>
                    <Grid container wrap={"nowrap"}>
                        <Box>
                            <Typography>
                                {otherPlayer ? `${otherPlayer!.id}` : "等待玩家加入"}
                            </Typography>
                            <LCHandView cards={createCards(8)} unknown/>
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
                                <Button disabled={!isMyTurn} variant={"outlined"} className={classes.button}
                                        onClick={() => setShowScore(s => !s)}>
                                    <Typography>
                                        计分
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <LCDeckView game={props.game}/>

                    <Grid container wrap={"nowrap"}>
                        <Box>
                            <LCHandView cards={sortedHand} selected={playCard === "none" ? undefined : playCard}
                                        onClick={onSelectPlayCard}/>
                            <Typography>
                                {myPlayer ? `${myPlayer!.id}` : "等待玩家加入"}
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
                                <Button disabled={!isMyTurn}
                                        variant={"outlined"}
                                        className={`${classes.button} ${playType === "play" ? classes.selectedPlayType : ""}`}
                                        onClick={() => onSelectPlayType("play")}>
                                    <Tooltip
                                        title={"选择出牌或弃牌"}
                                        open={op === "selectPlayType"}
                                        arrow placement={"right"}>
                                        <Typography>
                                            出牌
                                        </Typography>
                                    </Tooltip>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button disabled={!isMyTurn}
                                        variant={"outlined"}
                                        className={`${classes.button} ${playType === "drop" ? classes.selectedPlayType : ""}`}
                                        onClick={() => onSelectPlayType("drop")}>
                                    <Typography>
                                        弃牌
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    disabled={!props.game.playInfo.canSubmit()}
                                    className={classes.button}
                                    variant={"outlined"}
                                    onClick={() => submit()}>
                                    <Tooltip
                                        title={"点击确认操作"}
                                        open={op === "submit"}
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