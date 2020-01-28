import React, {useState} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Box, Button, Container, CssBaseline, ListItemText, Paper, Tooltip, Typography, Zoom} from "@material-ui/core";
import LCCardsView from "./cards";
import {LCCard, LCGame} from "../model/model";
import Grid from '@material-ui/core/Grid';
import LoopIcon from '@material-ui/icons/Loop';
import {useStateByProp} from "../../util/property";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DoneIcon from '@material-ui/icons/Done';
import SendIcon from '@material-ui/icons/Send';
import {playLC} from "../fetch/fetch";

const useStyles = makeStyles<Theme, BoardProp>({
    otherHand: {
        float: "left",
        cursor: "not-allowed",
    },
    myHand: {
        float: "right",
        cursor: props => {
            if (props.game.isMyTurn()) {
                return "pointer";
            } else {
                return "not-allowed";
            }
        }
    },
    otherBoard: {
        float: "right",
        marginRight: 10,
    },
    dropBoard: {},
    myBoard: {
        marginLeft: 10,
    },
    board: {
        margin: 10,
    },
    messageBox: {
        overflow: "auto",
        width: "100%",
        height: "100%",
    },
    button: {
        minWidth: 0,
    },
    selectedItem: {
        boxShadow: "0 0 10px #4a4",
    }
});

type BoardProp = {
    game: LCGame
}

enum HandSort {
    NULL = 0,
    COLOR,
    POINT
}

const LCBoardView: React.FunctionComponent<BoardProp> = (props) => {
    let classes = useStyles(props);
    let game = props.game;

    let [sort, setSort] = useState(HandSort.NULL);
    let [hand] = useStateByProp(game.myHand);
    let [deck] = useStateByProp(game.deck);
    // let [currentSeat] = useStateByProp(game.currentSeat);
    // let [player] = useStateByProp(game.player);
    let [myBoard] = useStateByProp(game.myBoard);
    let [otherBoard] = useStateByProp(game.otherBoard);
    let [dropBoard] = useStateByProp(game.dropBoard);
    let [messages] = useStateByProp(game.messages);

    let [active, setActive] = useState(game.isMyTurn());

    let [playCard, setPlayCard] = useState<LCCard | undefined>(undefined);
    let [playType, setPlayType] = useState<"play" | "drop" | undefined>(undefined);
    let [drawType, setDrawType] = useState<"deck" | number | undefined>(undefined);

    game.currentSeat.addListener((ob, o, n) => {
        if (n === game.mySeat.value) {
            setActive(true);
        }
    });

    let sortedHand = hand.slice().sort((a, b) => {
        switch (sort) {
            case HandSort.NULL:
                return hand.indexOf(a) - hand.indexOf(b);
            case HandSort.COLOR:
                return (a.colorNumber() - b.colorNumber()) * 100 + (a.pointNumber() - b.pointNumber());
            case HandSort.POINT:
                return (a.pointNumber() - b.pointNumber()) * 100 + (a.colorNumber() - b.colorNumber());
            default:
                return 0;
        }
    });

    let op: "selectCard" | "selectPlayType" | "selectDraw" | "submit" | "idle" = function () {
        if (!active) {
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

    function isDropColor(i: number): boolean {
        return (playCard && playType === "drop" && playCard.color === i) || false;
    }

    function submit() {
        playLC(game, playCard!, playType!, drawType!)
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth={"md"}>
                <Grid container wrap={"wrap"}>
                    <Grid item xs={10}>
                        <Box className={classes.otherHand}>
                            <LCCardsView cards={LCCard.unknowns(7)}/>
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Tooltip title={op === "selectDraw" ? "从牌库摸牌" : ""} open arrow>
                            <Button
                                className={`${drawType === "deck" && classes.selectedItem}`}
                                onClick={() => {
                                    setDrawType(drawType === "deck" ? undefined : "deck");
                                }}>
                                <Typography>
                                    牌库剩余：{deck}
                                </Typography>
                            </Button>
                        </Tooltip>
                    </Grid>
                    {LCCard.Colors.map((e, i) => {
                        let dropCards = dropBoard[e];
                        return (
                            <Grid item container xs={12} key={i} className={classes.board}>
                                <Grid item xs={5}>
                                    <Box className={classes.otherBoard}>
                                        <LCCardsView cards={otherBoard[e]} mini reverse/>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={i === 0 && op === "selectDraw" ? "从弃牌堆摸牌" : ""} open arrow
                                             placement={"top"}>
                                        <Tooltip TransitionComponent={Zoom} placement={"right"} arrow leaveDelay={500}
                                                 title={dropCards.length === 0 ? "" :
                                                     <LCCardsView cards={dropCards} mini/>}>
                                            <Tooltip placement={"left"} arrow
                                                     title={isDropColor(i) ? "你不可以摸起刚刚弃置的牌" : ""}>
                                                <Button
                                                    style={{cursor: isDropColor(i) || dropCards.length === 0 ? "not-allowed" : undefined}}
                                                    className={`${classes.dropBoard} ${drawType === i && classes.selectedItem}`}
                                                    onClick={() => {
                                                        if (!isDropColor(i) && dropCards.length !== 0) {
                                                            setDrawType(drawType === i ? undefined : i);
                                                        }
                                                    }}>
                                                    <LCCardsView
                                                        cards={dropCards.length === 0 ? [new LCCard(e)] : dropCards.slice(dropCards.length - 1)}
                                                        mini/>
                                                </Button>
                                            </Tooltip>
                                        </Tooltip>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={5}>
                                    <Box className={classes.myBoard}>
                                        <LCCardsView cards={myBoard[e]} mini/>
                                    </Box>
                                </Grid>
                            </Grid>
                        )
                    })}
                    <Grid item xs={5}>
                        <Paper className={classes.messageBox}>
                            <Grid container>
                                {
                                    messages.map((msg, i) => {
                                        return (
                                            <Grid item xs={12} key={i}>
                                                <ListItemText primary={msg}/>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Tooltip title={(op === "selectCard") ? "选择卡牌" : ""} open arrow>
                            <Box className={classes.myHand}>
                                <LCCardsView cards={sortedHand} highlight={playCard}
                                             onClickCard={c => {
                                                 setPlayCard(playCard === c ? undefined : c);
                                             }}/>
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Tooltip title={op === "selectPlayType" ? "选择出牌方式" : (op === "submit" ? "点击确认操作" : "")} open arrow>
                        <Grid item container xs={1}>
                            <Grid item xs={12}>
                                <Tooltip title={"排序"} placement={"right"}>
                                    <div style={{float: "left"}}>
                                        <Button onClick={() => {
                                            switch (sort) {
                                                case HandSort.NULL:
                                                    setSort(HandSort.COLOR);
                                                    break;
                                                case HandSort.COLOR:
                                                    setSort(HandSort.POINT);
                                                    break;
                                                case HandSort.POINT:
                                                    setSort(HandSort.NULL);
                                                    break;
                                            }
                                        }} className={classes.button}>
                                            <LoopIcon/>
                                        </Button>
                                    </div>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title={"出牌"} placement={"right"} arrow>
                                    <div style={{float: "left"}}>
                                        <Button disabled={!active}
                                                className={`${classes.button} ${playType === "play" && classes.selectedItem}`}
                                                onClick={() => {
                                                    setPlayType(playType === "play" ? undefined : "play")
                                                }}>
                                            <SendIcon/>
                                        </Button>
                                    </div>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title={"弃牌"} placement={"right"} arrow>
                                    <div style={{float: "left"}}>
                                        <Button disabled={!active}
                                                className={`${classes.button} ${playType === "drop" && classes.selectedItem}`}
                                                onClick={() => {
                                                    setPlayType(playType === "drop" ? undefined : "drop")
                                                }}>
                                            <CancelOutlinedIcon/>
                                        </Button>
                                    </div>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title={"确认回合"} placement={"right"} arrow>
                                    <div style={{float: "left"}}>
                                        <Button disabled={!(active && playCard && playType && drawType)}
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
            </Container>
        </React.Fragment>
    )
};

export default LCBoardView;