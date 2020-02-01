import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Dialog,
    IconButton,
    InputBase,
    Paper,
    Snackbar,
    SnackbarProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
import {blue} from "@material-ui/core/colors";
import LCCardView, {cardColor, cardPoint} from "./card";
import AssignmentIcon from '@material-ui/icons/Assignment';
import Divider from '@material-ui/core/Divider';

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
    text: string
    hide?: boolean
    graphics?: React.ReactNode
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
    let [otherPlayer, setOtherPlayer] = useState<Player | undefined>(undefined);

    let [myBoard, setMyBoard] = useState<CardBoard>(emptyBoard);
    let [otherBoard, setOtherBoard] = useState<CardBoard>(emptyBoard);
    let [dropBoard, setDropBoard] = useState<CardBoard>(emptyBoard);
    let [messages, setMessages] = useState<React.ReactNode[]>([]);
    let [chatMsg, setChatMsg] = useState<string>("");

    let [showScore, setShowScore] = useState(false);
    let [myScore, setMyScore] = useState<LineScore[]>([]);
    let [otherScore, setOtherScore] = useState<LineScore[]>([]);

    let [state, setState] = useState<BoardState>("wait");
    let [error, setError] = useState("");
    let [validMsg, setValidMsg] = useState<Message | undefined>(undefined);
    let [infoMsg, setInfoMsg] = useState<Message | undefined>(undefined);

    let [playCard, setPlayCard] = useState<LCCard | undefined>(undefined);
    let [playType, setPlayType] = useState<PlayType | undefined>(undefined);
    let [drawType, setDrawType] = useState<DrawType | undefined>(undefined);

    let [sort, setSort] = useState(HandSort.NULL);

    let [ws, setWs] = useState<WSHandle | undefined>(undefined);

    useEffect(() => {
        let mySeat = 0;
        let otherPlayer: Player | undefined = undefined;

        function innerSetOtherPlayer(player: Player) {
            otherPlayer = player;
            setOtherPlayer(player);
        }

        let aws = autoWs({
            rel: `socket/game/lostcities/${id}?user=${global.id}`,
            oninit: () => {
                setState("wait");
            },
            onretry: () => {
                setState("connecting");
            },
            onerror: (e) => {
                setState("error");
                setError(`无法连接到服务器(${e.type})`)
            },
            onmessage: (e) => {
                let event = JSON.parse(e.data);
                let data = event.payload;

                function getWhoBySeat(seat: number) {
                    return (seat === mySeat) ? "你" : (otherPlayer!.id);
                }

                function getWhoById(id: string) {
                    return (id === global.id) ? "你" : (otherPlayer!.id);
                }

                function updateGameInfo() {
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
                }

                switch (event.topic) {
                    case "error":
                        setState("error");
                        setError(data);
                        aws.close();
                        break;
                    case "chat":
                        addMessage(<ChatMessage who={getWhoById(data.id)} text={data.text}/>);
                        break;
                    case "host-info":
                        data.players.forEach((p: any) => {
                            if (p) {
                                if (p.id === global.id) {
                                    mySeat = p.seat;
                                    if (!p.ready) {
                                        aws.send(JSON.stringify({
                                            topic: "ready",
                                            payload: true,
                                        }))
                                    }
                                    addMessage(`你加入了游戏: ${id}`)
                                } else {
                                    innerSetOtherPlayer(new LCPlayer(p.id, p.seat, p.connected, p.ready));
                                    addMessage(`[${p.id}]加入了游戏`)
                                }
                            }
                        });
                        break;
                    case "join":
                        if (data.seat === 1 - mySeat) {
                            innerSetOtherPlayer(new LCPlayer(data.id, data.seat, data.connected, data.ready));
                            addMessage(`[${data.id}]加入了游戏`);
                        }
                        break;
                    case "start":
                        addMessage("游戏开始");
                        updateGameInfo();
                        break;
                    case "game-info":
                        updateGameInfo();
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
                        addMessage(<PlayMessage who={"你"} op={"deck"} card={drawCard}/>);
                        break;
                    case "play":
                        let who = getWhoBySeat(data.seat);
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
                            addMessage(<PlayMessage who={who} op={"drop"} card={card}/>)
                        } else {
                            if (data.seat === mySeat) {
                                addToBoard(setMyBoard, card);
                            } else {
                                addToBoard(setOtherBoard, card);
                            }
                            addMessage(<PlayMessage who={who} op={"play"} card={card}/>)
                        }
                        if (data.deck) {
                            setDeck(d => d - 1);
                            if (data.seat !== mySeat) {
                                addMessage(<PlayMessage who={who} op={"deck"}/>);
                            }
                        } else {
                            let drawDropCard = new LCCard(data["draw-drop-card"]);
                            removeFromBoard(setDropBoard, drawDropCard);
                            addMessage(<PlayMessage who={who} op={"draw-drop"} card={drawDropCard}/>);
                            if (data.seat === mySeat) {
                                setHand(h => {
                                    let s = h.slice();
                                    s.push(drawDropCard);
                                    return s;
                                });
                            }
                        }
                }
            }
        });
        setWs(aws);
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

    useEffect(() => {
        setValidMsg(function (): Message | undefined {
            if (playCard && playType === "drop" && playCard.color === drawType) {
                return {level: "warning", text: "你不可以摸起即将打出的牌"};
            }
            if (drawType !== undefined && drawType !== "deck" && dropBoard[drawType].length === 0) {
                return {level: "warning", text: "弃牌堆中没有可用的牌"};
            }
            if (playCard && playType === "play" && playCard.pointNumber() < maxPoint(myBoard[playCard.colorNumber()])) {
                return {level: "warning", text: "同一系列点数必须递增"}
            }
            return undefined;
        }());
    }, [playCard, playType, drawType, dropBoard, myBoard]);

    useEffect(() => {
        setInfoMsg(function (): Message | undefined {
            switch (state) {
                case "wait":
                    return {level: "info", text: "等待其他玩家连接"};
                case "connecting":
                    return {level: "info", text: "正在连接", graphics: <CircularProgress color="inherit"/>};
                case "error":
                    return {level: "error", text: `错误：${error}`};
                case "my":
                    return {level: "info", text: "你的回合"};
                case "other":
                    return {level: "info", text: "对手回合"};
                case "over":
                    return {level: "info", text: "游戏结束"};
            }
            return undefined;
        }());
    }, [state, error]);

    useEffect(() => {
        setMyScore(calcBoardScore(myBoard));
    }, [myBoard]);

    useEffect(() => {
        setOtherScore(calcBoardScore(otherBoard))
    }, [otherBoard]);

    let canSubmit = state === "my" && playCard && playType && drawType !== undefined && (!validMsg || (validMsg.level === "info" || validMsg.level === "success"));

    function doInMyTurn(task: () => void) {
        if (state === "my") {
            task()
        } else if (state === "other") {
            setValidMsg({
                text: "现在不是你的回合",
                level: "warning",
                hide: true,
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
                    "draw-color": (drawType === "deck") ? undefined : drawType,
                },
            }));
            setPlayCard(undefined);
            setPlayType(undefined);
            setDrawType(undefined);
        });
    }

    function addMessage(msg: React.ReactNode) {
        setMessages(msgs => {
            msgs.push(msg);
            return msgs.slice();
        });
    }

    function sendChat() {
        ws && ws.send(JSON.stringify({
            topic: "chat",
            payload: chatMsg,
        }));
        setChatMsg("");
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

    function hasScore() {
        return state === "my" || state === "other" || state === "over"
    }

    let msgBoxRef = useRef<Element | undefined>(undefined);

    useEffect(() => {
        let current = msgBoxRef.current;
        current && (current.scrollTop = current.scrollHeight);
    }, [messages]);

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth={"md"} style={{paddingTop: 15, position: "relative"}}>
                <Grid container wrap={"wrap"}>
                    <Grid item xs={6}>
                        <Box>
                            {otherPlayer ? (
                                `${otherPlayer!.id}`
                            ) : (
                                "等待玩家加入"
                            )}
                        </Box>
                        <Box className={classes.otherHand}>
                            <LCCardsView cards={LCCard.unknowns(8)}/>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box style={{float: "right"}}>
                            <IconButton onClick={() => hasScore() && setShowScore(s => !s)}>
                                <Tooltip title={"计分"}>
                                    <AssignmentIcon/>
                                </Tooltip>
                            </IconButton>
                            <Tooltip title={op === "selectDraw" ? "从牌库摸牌" : ""} open arrow>
                                <Button
                                    className={`${drawType === "deck" && classes.selectedItem}`}
                                    onClick={() => selectDrawType("deck")}>
                                    <Typography>
                                        牌库剩余：{deck}
                                    </Typography>
                                </Button>
                            </Tooltip>
                        </Box>
                    </Grid>
                    {LCCard.Colors.map((e, i) => {
                        let dropCards = dropBoard[e];
                        return (
                            <Grid item container xs={12} key={i} className={classes.board} alignItems="center">
                                <Grid item xs={5}>
                                    <Tooltip title={otherScore[i]?.develop ? "" : ""}>
                                        <Box className={classes.otherBoard}>
                                            <LCCardsView cards={otherBoard[e]} mini reverse/>
                                        </Box>
                                    </Tooltip>
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
                        <Paper style={{height: "100%"}} elevation={3}>
                            <Paper className={classes.messageBox} style={{maxHeight: 130}} ref={msgBoxRef}>
                                <Grid container>
                                    {
                                        messages.map((msg, i) => {
                                            return (
                                                <Grid item xs={12} key={i}>
                                                    {msg}
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Paper>
                            <Divider/>
                            <InputBase placeholder="发送消息"
                                       style={{width: "100%"}}
                                       value={chatMsg}
                                       onChange={e => setChatMsg(e.target.value)}
                                       onKeyPress={(e) => {
                                           if (e.key === 'Enter') {
                                               sendChat();
                                               e.preventDefault();
                                           }
                                       }}/>
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
                <MessageSnackbar message={validMsg} onClose={() => setValidMsg(undefined)}/>
                <MessageSnackbar message={infoMsg}
                                 onClose={() => setInfoMsg(undefined)}
                                 snackbar={{
                                     anchorOrigin: {horizontal: "center", vertical: "top"},
                                     style: {position: "absolute"}
                                 }}/>
                {showScore && <Dialog open onClose={() => setShowScore(false)}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell/>
                                    <TableCell>对手得分</TableCell>
                                    <TableCell>你的得分</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    LCCard.Colors.map(i => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <LCCardView card={new LCCard(0, i)} mini/>
                                            </TableCell>
                                            <TableCell align={"center"}>
                                                <Tooltip title={<LineScoreView score={otherScore[i]}/>} arrow
                                                         TransitionComponent={Zoom}>
                                                    <Box>
                                                        {otherScore[i].sum}
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align={"center"}>
                                                <Tooltip title={<LineScoreView score={myScore[i]}/>} arrow
                                                         TransitionComponent={Zoom}>
                                                    <Box>
                                                        {myScore[i].sum}
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                                <TableRow>
                                    <TableCell>总分</TableCell>
                                    <TableCell align={"center"}>
                                        {sumScore(otherScore)}
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        {sumScore(myScore)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Dialog>
                }
            </Container>
        </React.Fragment>
    )
};

type MessageProp = {
    message?: Message,
    onClose: () => void,
    snackbar?: Pick<SnackbarProps, Exclude<keyof SnackbarProps, "open" | "onClose">>
};

const MessageSnackbar: React.FunctionComponent<MessageProp> = (props) => {
    if (props.message) {
        return (
            <Snackbar open autoHideDuration={props.message.hide ? 5000 : null}
                      onClose={() => {
                          if (props.message!.hide) {
                              props.onClose();
                          }
                      }}
                      {...props.snackbar}>
                <Alert severity={props.message.level}>
                    {props.message.text}
                    {props.message.graphics}
                </Alert>
            </Snackbar>
        )
    } else {
        return (null);
    }
};

function ChatMessage(props: {
    who: string,
    text: string,
}) {
    return (
        <Box>
            <PlayerMessage who={props.who}/>
            :
            <span>{props.text}</span>
        </Box>
    )
}

function PlayMessage(props: {
    who: string,
    op: "play" | "drop" | "deck" | "draw-drop",
    card?: LCCard
}) {
    return (
        <Box>
            <PlayerMessage who={props.who}/>
            {function () {
                switch (props.op) {
                    case "play":
                        return "打出了";
                    case "drop":
                        return "弃置了";
                    case "deck":
                        return "从牌库抽牌";
                    case "draw-drop":
                        return "从弃牌堆中摸起了";
                }
            }()}
            {props.card && <CardMessage card={props.card!}/>}
        </Box>
    )
}

function CardMessage(props: { card: LCCard }) {
    return <div style={{
        display: "inline-block",
        backgroundColor: cardColor(props.card.color),
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
        minWidth: 15,
        textAlign: "center",
    }}>
        {cardPoint(props.card.point)}
    </div>
}

function PlayerMessage(props: { who: string }) {
    return <span style={{
        borderColor: blue[100],
        borderStyle: "solid",
        borderWidth: 2,
    }}>
        {props.who}
    </span>
}

function LineScoreView(props: { score: LineScore }) {
    if (props.score.develop) {
        return <Box>
            {`(${props.score.score} - 20) x ${props.score.times} + ${props.score.bonus ? 20 : 0} = ${props.score.sum}`}
        </Box>
    } else {
        return <Box>0</Box>;
    }
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

type BoardScore = LineScore[];
type LineScore = {
    develop: boolean,
    times: number,
    score: number,
    bonus: boolean,
    sum: number,
};

function sumScore(s: BoardScore): number {
    return s.reduce((a, b) => a + b.sum, 0);
}

function calcBoardScore(board: CardBoard): LineScore[] {
    return board.map(calcLineScore);
}

function calcLineScore(board: LCCard[]): LineScore {
    let score = 0;
    let times = 1;
    let points = 0;
    if (board.length === 0) {
        return {
            develop: false,
            times: times,
            score: score,
            bonus: false,
            sum: 0,
        };
    }
    board.forEach(c => {
        if (c.color === "unknown" || c.point === undefined) {
            return;
        }
        if (c.point === "double") {
            times++;
        } else {
            points++;
            score += c.point;
        }
    });
    let bonus = points >= 8;
    return {
        develop: true,
        times: times,
        score: score,
        bonus: bonus,
        sum: times * (score - 20) + (bonus ? 20 : 0),
    };
}

export default LCBoardView;