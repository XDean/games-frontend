import React, {useState} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {
    Box,
    Button,
    Container,
    CssBaseline,
    List,
    ListItem,
    ListItemText,
    Paper,
    Tooltip,
    Typography,
    Zoom
} from "@material-ui/core";
import LCCardsView from "./cards";
import {LCCard, LCGame} from "../model/model";
import Grid from '@material-ui/core/Grid';
import LoopIcon from '@material-ui/icons/Loop';
import {useStateByProp} from "../../util/property";

const useStyles = makeStyles<Theme, BoardProp>({
    otherHand: {
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
    sortButton: {
        minWidth: 0,
    },
    messageBox: {
        overflow: "auto",
        width: "100%",
        height: "100%",
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

    let [op, setOp] = useState<"play" | "draw" | "">(game.isMyTurn() ? "play" : "");
    game.currentSeat.addListener((ob, o, n) => {
        if (n === game.mySeat.value) {
            setOp("play");
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

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth={"md"}>
                <Grid container wrap={"wrap"}>
                    <Grid item xs={10}>
                        <LCCardsView cards={LCCard.unknowns(7)}/>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>
                            牌库剩余：{deck}
                        </Typography>
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
                                    <Tooltip TransitionComponent={Zoom} placement={"right"} arrow leaveDelay={500}
                                             title={dropCards.length === 0 ? "" :
                                                 <LCCardsView cards={dropCards} mini/>}>
                                        <Box className={classes.dropBoard}>
                                            <LCCardsView
                                                cards={dropCards.length === 0 ? [new LCCard(e)] : dropCards.slice(dropCards.length - 1)}
                                                mini/>
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
                        <Box className={classes.myHand}>
                            <LCCardsView cards={sortedHand} onPlayCard={c => {

                            }}/>
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
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
                        }} className={classes.sortButton}>
                            <Tooltip title={"排序"}>
                                <LoopIcon/>
                            </Tooltip>
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
};

export default LCBoardView;