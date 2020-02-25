import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Box, Button, Grid, Tooltip, Typography} from "@material-ui/core";
import LCHandView from "./hand";
import {createCards, LCCard, LCCards} from "../model/card";
import {LCTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {DrawType, LCGame, PlayType} from "../model/board";
import LCColorBoardView from "./color-board";
import {AppTheme} from "../../../theme";
import {useStateByProp} from "../../../util/property";
import LCDeckView from "./deck";

const useStyles = makeStyles<typeof AppTheme>(theme => createStyles({
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

type LCBoardProp = {
    game: LCGame
}

const LCBoardView: React.FunctionComponent<LCBoardProp> = (props) => {
    const classes = useStyles();
    const role = useStateByProp(props.game.host.myRole)[0];
    const playing = useStateByProp(props.game.host.playing)[0];

    const mySeat = useStateByProp(props.game.host.mySeat)[0];
    const otherSeat = 1 - mySeat;

    const hand = useStateByProp(props.game.board.hand)[0];
    const myHand = hand[mySeat];
    const otherHand = hand[otherSeat];

    const player = useStateByProp(props.game.host.players)[0];
    const myPlayer = player[mySeat];
    const otherPlayer = player[otherSeat];

    const deck = useStateByProp(props.game.board.deck)[0];

    const current = useStateByProp(props.game.board.current)[0];

    const [playCard, setPlayCard] = useState<LCCard>();
    const [playType, setPlayType] = useState<PlayType>();
    const [drawType, setDrawType] = useState<DrawType>();

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
            <Grid container wrap={"nowrap"} alignItems={"center"} className={classes.root}>
                <Grid item className={classes.chat}>
                    <ChatView controller={props.game.plugins.chat}/>
                </Grid>
                <Grid item className={classes.board}>
                    <LCColorBoardView board={props.game.board} mySeat={mySeat}/>
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
                                <Button onClick={() => setShowHelp(true)} className={classes.button}
                                        variant={"outlined"}>
                                    <Typography>
                                        帮助
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button disabled={!isMyTurn} variant={"outlined"} className={classes.button}
                                        onClick={() => setShowScore(true)}>
                                    <Typography>
                                        计分
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <LCDeckView count={deck}/>

                    <Grid container wrap={"nowrap"}>
                        <Box>
                            <LCHandView cards={sortedHand} selected={playCard}
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
                                        className={`${classes.button} ${playType === "play" && classes.selectedItem}`}
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
                                        className={`${classes.button} ${playType === "drop" && classes.selectedItem}`}
                                        onClick={() => onSelectPlayType("drop")}>
                                    <Typography>
                                        弃牌
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    disabled={!canSubmit}
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
        </ThemeProvider>
    )
};

export default LCBoardView;