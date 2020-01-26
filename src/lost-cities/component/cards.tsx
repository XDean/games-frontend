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
            if (props.vertical) {
                return props.mini ? 35 : 85
            } else {
                return props.cards.length * 35 + (props.mini ? 0 : 85)
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
        "&:hover": {
            width: props => props.mini ? 35 : 85,
        }
    },
    vertical: {
        height: 35,
        "&:hover": {
            height: props => props.mini ? 35 : 150,
        }
    }
});

type LCCardsProp = {
    cards: LCCard[]
    onPlayCard?: (card: LCCard) => void,
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
                (props.reverse ? props.cards.reverse() : props.cards).map((c, i) => {
                    return (
                        <Grid item
                              className={props.vertical ? classes.vertical : classes.horizontal}
                              key={i} onDoubleClick={e => {
                            props.onPlayCard && props.onPlayCard(c)
                        }}>
                            <LCCardView card={c} mini={props.mini}/>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
};

export default LCCards;