import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Container, CssBaseline} from "@material-ui/core";
import LCCardsView from "./cards";
import {mockGame} from "../model/mock";
import {LCCard} from "../model/model";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    myHand: {
        float: "right",
    },
    otherBoard: {
        float: "right",
    }
});

type BoardProp = {
    id: string
}

const LCBoardView: React.FunctionComponent<BoardProp> = (props) => {
    let classes = useStyles();
    let game = mockGame();

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth={"md"}>
                <Grid container wrap={"wrap"}>
                    <Grid item xs={12}>
                        <LCCardsView cards={LCCard.unknowns(7)}/>
                    </Grid>
                    {LCCard.Colors.map((e, i) => {
                        let dropCards = game.dropBoard.value[e];
                        return (
                            <Grid item container xs={12} key={i}>
                                <Grid item xs={5}>
                                    <Box className={classes.otherBoard}>
                                        <LCCardsView cards={game.otherBoard.value[e]} mini={true} reverse={true}/>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <LCCardsView
                                        cards={dropCards.length === 0 ? [new LCCard(e, 0)] : dropCards.slice(dropCards.length - 1)}
                                        mini={true}/>
                                </Grid>
                                <Grid item xs={5}>
                                    <LCCardsView cards={game.myBoard.value[e]} mini={true}/>
                                </Grid>
                            </Grid>
                        )
                    })}
                    <Grid item xs={12}>
                        <Box className={classes.myHand}>
                            <LCCardsView cards={game.myHand.value}/>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
};

export default LCBoardView;