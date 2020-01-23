import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {LCCard} from "../model/model";
import LCCardView from "./card";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles<Theme, LCCardsProp>({
    hand: {
        userSelect: "none",
        display: "inline-flex",
        margin: 10,
        width: props => {
            if (props.orientation === "horizontal") {
                return props.cards.length * 30 + 85
            } else {
                return 85
            }
        },
        height: props => {
            if (props.orientation === "horizontal") {
                return 150
            } else {
                return props.cards.length * 35 + 150
            }
        }
    },
    horizontalCard: {
        width: 30,
        "&:hover": {
            width: 85,
        }
    },
    verticalCard: {
        height: 35,
        "&:hover": {
            height: 150,
        }
    }
});

type LCCardsProp = {
    cards: LCCard[]
    onPlayCard: (card: LCCard) => void,
    orientation: "horizontal" | "vertical",
    reverse?: boolean,
}

const LCCards: React.FunctionComponent<LCCardsProp> = (props) => {

    const classes = useStyles(props);

    return (
        <Grid container className={classes.hand}
              direction={props.orientation === "horizontal" ? "row" : "column"}>
            {
                (props.reverse ? props.cards.reverse() : props.cards).map((c, i) => {
                    return (
                        <Grid item
                              className={props.orientation === "horizontal" ? classes.horizontalCard : classes.verticalCard}
                              key={i} onDoubleClick={e => {
                            props.onPlayCard(c)
                        }}>
                            <LCCardView card={c}/>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
};

export default LCCards;