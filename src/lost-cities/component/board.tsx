import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Button, Container, CssBaseline, Tooltip, Typography, Zoom} from "@material-ui/core";
import LCCardsView from "./cards";
import {LCCard} from "../model/model";
import Grid from '@material-ui/core/Grid';
import LoopIcon from '@material-ui/icons/Loop';
import {connectLC} from "../fetch/fetch";
import {useStateByProp} from "../../util/property";

const useStyles = makeStyles({
    otherHand: {},
    myHand: {
        float: "right",
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
    }
});

type BoardProp = {
    id: string
}

enum HandSort {
    NULL = 0,
    COLOR,
    POINT
}

const LCBoardView: React.FunctionComponent<BoardProp> = (props) => {
    let classes = useStyles();
    let game = connectLC(props.id);

    let [sort, setSort] = useState(HandSort.NULL);
    let [hand] = useStateByProp(game.myHand);
    let [deck] = useStateByProp(game.deck);
    let [currentSeat] = useStateByProp(game.currentSeat);
    let [player] = useStateByProp(game.player);
    let [myBoard] = useStateByProp(game.myBoard);
    let [otherBoard] = useStateByProp(game.otherBoard);
    let [dropBoard] = useStateByProp(game.dropBoard);

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
                    <Grid item xs={11}>
                        <Box className={classes.myHand}>
                            <LCCardsView cards={sortedHand}/>
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