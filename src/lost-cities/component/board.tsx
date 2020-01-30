import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    ListItemText,
    Paper,
    Snackbar,
    Tooltip,
    Typography,
    Zoom
} from "@material-ui/core";
import LCCardsView from "./cards";
import {LCCard, LCGame, LCPlayer} from "../model/model";
import Grid from '@material-ui/core/Grid';
import LoopIcon from '@material-ui/icons/Loop';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DoneIcon from '@material-ui/icons/Done';
import SendIcon from '@material-ui/icons/Send';
import {autoWs, WSHandle} from "../../util/ws";
import global from "../../global";
import {Color} from '@material-ui/lab/Alert';
import {Alert} from "../../components/snippts";
import {useParams} from "react-router";

const useStyles = makeStyles<Theme, BoardProp>({
    backdrop: {
        zIndex: 100,
        color: '#fff',
    },
    otherHand: {
        float: "left",
        cursor: "not-allowed",
    },
    myHand: {
        float: "right",
        cursor: "pointer",
    },
    notAllow: {
        cursor: "not-allowed",
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

type BoardProp = {}

type Player = {
    id: string,
    seat: number,
    connected: boolean,
    ready: boolean,
}

type Operation = "selectCard" | "selectPlayType" | "selectDraw" | "submit" | "idle";
type BoardState = "connecting" | "error" | "wait" | "my" | "other" | "over";
type PlayType = "play" | "drop"
type DrawType = "deck" | number
type Message = {
    level: Color
    msg: string
    hide?: boolean
}
type CardBoard = LCCard[][];

function maxPoint(cards: LCCard[]): number {
    return cards.map(c => c.pointNumber()).reduce((a, b) => a > b ? a : b, -1);
}

enum HandSort {
    NULL = 0,
    COLOR,
    POINT
}

const emptyBoard = [[], [], [], [], []];

const LCBoardView: React.FunctionComponent<BoardProp> = (props) => {
    const {id} = useParams();
    let classes = useStyles(props);

    let [hand, setHand] = useState<LCCard[]>([]);
    let [deck, setDeck] = useState<number>(0);
    // let [currentSeat] = useStateByProp(game.currentSeat);
    let [player, setPlayer] = useState<Player | undefined>(undefined);
    let [myBoard, setMyBoard] = useState<CardBoard>(emptyBoard);
    let [otherBoard, setOtherBoard] = useState<CardBoard>(emptyBoard);
    let [dropBoard, setDropBoard] = useState<CardBoard>(emptyBoard);
    let [messages, setMessages] = useState<string[]>([]);

    let [state, setState] = useState<BoardState>("wait");
    let [error, setError] = useState("");
    let [tempMsg, setTempMsg] = useState<Message | undefined>(undefined);

    let [playCard, setPlayCard] = useState<LCCard | undefined>(undefined);
    let [playType, setPlayType] = useState<PlayType | undefined>(undefined);
    let [drawType, setDrawType] = useState<DrawType | undefined>(undefined);

    let [sort, setSort] = useState(HandSort.NULL);

    let [ws, setWs] = useState<WSHandle | undefined>(undefined);

    useEffect(() => {
        function addMessage(msg: string) {
            setMessages([...messages, msg]);
        }

        function addToBoard(setBoard: Dispatch<SetStateAction<CardBoard>>, card: LCCard) {
            setBoard(b => {
                let s = b.slice();
                s[card.colorNumber()].push(card);
                return s;
            });
        }

        function removeFromBoard(setBoard: Dispatch<SetStateAction<CardBoard>>, card: LCCard) {
            setBoard(b => {
                let s = b.slice();
                let index = s[card.colorNumber()].findIndex(c => c.int === card.int);
                s[card.colorNumber()].splice(index, 1);
                return s;
            });
        }

        let mySeat = 0;
        let ws = autoWs({
            rel: `socket/game/lostcities/${id}?user=${global.id}`,
            onopen: () => {
                setState("wait");
            },
            onretry: () => {
                setState("connecting");
            },
            onerror: (ws, e) => {
                setError(e.type);
                setState("error");
            },
            onmessage: (ws, e) => {
                let event = JSON.parse(e.data);
                let data = event.payload;

                switch (event.topic) {
                    case "host-info":
                        data.players.forEach((p: any) => {
                            if (p) {
                                if (p.id === global.id) {
                                    mySeat = p.seat;
                                    addMessage(`你加入了游戏: ${id}`)
                                } else {
                                    setPlayer(new LCPlayer(p.id, p.seat, p.connected, p.ready));
                                    addMessage(`[${p.id}]加入了游戏`)
                                }
                            }
                        });
                        break;
                    case "join":
                        if (data.seat === 1 - mySeat) {
                            setPlayer(new LCPlayer(data.id, data.seat, data.connected, data.ready));
                            addMessage(`[${data.id}]加入了游戏`);
                        }
                        break;
                    case "game-info":
                        if (data.over) {
                            setState("over")
                        } else {
                            setState(data["current-seat"] === mySeat ? "my" : "other");
                        }
                        setDeck(data.deck);
                        setHand(data.hand.map((v: number) => new LCCard(v)));

                        let getBoard = function (key: string): CardBoard {
                            let res = LCGame.emptyBoard();
                            data[key].forEach((colors: any[], index: number) => {
                                res[index] = colors.map(c => new LCCard(c));
                            });
                            return res
                        };
                        setMyBoard(getBoard("my-board"));
                        setOtherBoard(getBoard("other-board"));
                        setDropBoard(getBoard("drop-board"));
                        break;
                    case "turn":
                        setState(data === mySeat ? "my" : "other");
                        break;
                    case "over":
                        setState("over");
                        break;
                    case "draw":
                        let drawCard = new LCCard(data);
                        setHand(h => {
                            let s = h.slice();
                            s.push(drawCard);
                            return s;
                        });
                        break;
                    case "play":
                        let card = new LCCard(data.card);
                        if (data.seat === mySeat) {
                            setHand(h => {
                                let s = h.slice();
                                let index = h.findIndex(c => c.int === card.int);
                                s.splice(index, 1);
                                return s;
                            });
                        }
                        if (data.drop) {
                            addToBoard(setDropBoard, card);
                        } else if (data.seat === mySeat) {
                            addToBoard(setMyBoard, card);
                        } else {
                            addToBoard(setOtherBoard, card);
                        }
                        if (data.deck) {
                            setDeck(d => d - 1);
                        } else {
                            removeFromBoard(setDropBoard, card);
                        }
                }
            }
        });
        setWs(ws);
    }, [id]);

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

    let op: Operation = function () {
        if (state !== "my") {
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

    let warn = function (): Message | undefined {
        if (playCard && playType === "drop" && playCard.color === drawType) {
            return {level: "warning", msg: "你不可以摸起即将打出的牌"};
        }
        if (drawType !== undefined && drawType !== "deck" && dropBoard[drawType].length === 0) {
            return {level: "warning", msg: "弃牌堆中没有可用的牌"};
        }
        if (playCard && playType === "play" && playCard.pointNumber() < maxPoint(myBoard[playCard.colorNumber()])) {
            return {level: "warning", msg: "同一系列点数必须递增"}
        }
        return tempMsg && {
            ...tempMsg,
            hide: true,
        };
    }();

    let canSubmit = state === "my" && playCard && playType && drawType && (!warn || (warn.level === "info" || warn.level === "success"));

    function doInMyTurn(task: () => void) {
        if (state === "my") {
            task()
        } else if (state === "other") {
            setTempMsg({
                msg: "现在不是你的回合",
                level: "warning",
            })
        }
    }

    function selectPlayCard(card: LCCard) {
        doInMyTurn(() => {
            setPlayCard(playCard === card ? undefined : card);
        });
    }

    function selectPlayType(type: PlayType) {
        doInMyTurn(() => {
            setPlayType(playType === type ? undefined : type);
        });
    }

    function selectDrawType(type: DrawType) {
        doInMyTurn(() => {
            setDrawType(drawType === type ? undefined : type);
        });
    }

    function submit() {
        doInMyTurn(() => {
            ws && ws.send(JSON.stringify({
                topic: "play",
                payload: {
                    card: playCard!.int,
                    drop: playType! === "drop",
                    deck: drawType === "deck",
                    color: (drawType === "deck") ? undefined : drawType,
                },
            }));
            setPlayCard(undefined);
            setPlayType(undefined);
            setDrawType(undefined);
        });
    }

    function onSort() {
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
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <Backdrop className={classes.backdrop} open={state === "connecting"}>
                <CircularProgress color="inherit"/>
                正在连接服务器
            </Backdrop>
            <Container maxWidth={"md"} style={{paddingTop: 15}}>
                <Grid container wrap={"wrap"}>
                    <Grid item xs={10}>
                        <Box>
                            {player ? (
                                `${player!.id}`
                            ) : (
                                "等待玩家加入"
                            )}
                        </Box>
                        <Box className={classes.otherHand}>
                            <LCCardsView cards={LCCard.unknowns(7)}/>
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Tooltip title={op === "selectDraw" ? "从牌库摸牌" : ""} open arrow>
                            <Button
                                className={`${drawType === "deck" && classes.selectedItem}`}
                                onClick={() => selectDrawType("deck")}>
                                <Typography>
                                    牌库剩余：{deck}
                                </Typography>
                            </Button>
                        </Tooltip>
                    </Grid>
                    {LCCard.Colors.map((e, i) => {
                        let dropCards = dropBoard[e];
                        return (
                            <Grid item container xs={12} key={i} className={classes.board} alignItems="center">
                                <Grid item xs={5}>
                                    <Box className={classes.otherBoard}>
                                        <LCCardsView cards={otherBoard[e]} mini reverse/>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={i === 0 && op === "selectDraw" ? "从弃牌堆摸牌" : ""} open arrow
                                             placement={"top"}>
                                        <Box>
                                            <Tooltip TransitionComponent={Zoom} placement={"right"} arrow
                                                     leaveDelay={500}
                                                     title={dropCards.length === 0 ? "" :
                                                         <LCCardsView cards={dropCards} mini/>}>
                                                <Button
                                                    className={`${classes.dropBoard} ${drawType === i && classes.selectedItem}`}
                                                    onClick={() => selectDrawType(i)}>
                                                    <LCCardsView
                                                        cards={dropCards.length === 0 ? [new LCCard(0, e)] : dropCards.slice(dropCards.length - 1)}
                                                        mini/>
                                                </Button>
                                            </Tooltip>
                                        </Box>
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
                                             onClickCard={selectPlayCard}/>
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Tooltip title={op === "selectPlayType" ? "选择出牌方式" : (op === "submit" ? "点击确认操作" : "")} open arrow>
                        <Grid item container xs={1}>
                            <Grid item xs={12}>
                                <Tooltip title={"排序"} placement={"right"}>
                                    <div style={{float: "left"}}>
                                        <Button onClick={onSort} className={classes.button}>
                                            <LoopIcon/>
                                        </Button>
                                    </div>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title={"出牌"} placement={"right"} arrow>
                                    <div style={{float: "left"}}>
                                        <Button disabled={state !== "my"}
                                                className={`${classes.button} ${playType === "play" && classes.selectedItem}`}
                                                onClick={() => selectPlayType("play")}>
                                            <SendIcon/>
                                        </Button>
                                    </div>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title={"弃牌"} placement={"right"} arrow>
                                    <div style={{float: "left"}}>
                                        <Button disabled={state !== "my"}
                                                className={`${classes.button} ${playType === "drop" && classes.selectedItem}`}
                                                onClick={() => selectPlayType("drop")}>
                                            <CancelOutlinedIcon/>
                                        </Button>
                                    </div>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
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
                <Snackbar open={warn !== undefined} autoHideDuration={warn && warn.hide ? 5000 : null}
                          transitionDuration={0} onClose={() => setTempMsg(undefined)}>
                    <Alert severity={warn && warn.level}>
                        {warn && warn.msg}
                    </Alert>
                </Snackbar>
            </Container>
        </React.Fragment>
    )
};

export default LCBoardView;