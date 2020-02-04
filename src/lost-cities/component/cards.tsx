import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {LCCard} from "../model/model";
import LCCardView from "./card";
import Grid from "@material-ui/core/Grid";
import {Box} from "@material-ui/core";

const useStyles = makeStyles<Theme, LCCardsProp>({
    hand: {
        userSelect: "none",
        display: "inline-flex",
        width: props => {
            if (props.vertical) {
                return props.mini ? 35 : 85
            } else {
                return props.cards.length * 35 + (props.mini ? 0 : 100)
            }
        },
        height: props => {
            if (props.vertical) {
                return props.cards.length * 35 + (props.mini ? 0 : 150)
            } else {
                return props.mini ? 35 : 150
            }
        }
    },
    horizontal: {
        width: 35,
    },
    vertical: {
        height: 35,
    },
    highlight: {
        position: "relative",
        top: -10,
    }
});

type LCCardsProp = {
    cards: LCCard[]
    highlight?: LCCard
    onClickCard?: (card: LCCard) => void,
    vertical?: boolean,
    reverse?: boolean,
    mini?: boolean,
}

const LCCards: React.FunctionComponent<LCCardsProp> = (props) => {

    const classes = useStyles(props);

    return (
        <Grid container className={classes.hand}
              direction={props.vertical ? "column" : "row"}>
            {
                (props.reverse ? props.cards.slice().reverse() : props.cards).map((c, i) => {
                    return (
                        <Grid item
                              className={props.vertical ? classes.vertical : classes.horizontal}
                              key={i} onClick={e => {
                            props.onClickCard && props.onClickCard(c)
                        }}>
                            <Box className={props.highlight === c ? classes.highlight : ""}>
                                <LCCardView card={c} mini={props.mini}/>
                            </Box>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
};

export default LCCards;