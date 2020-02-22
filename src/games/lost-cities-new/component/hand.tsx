import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {LCCard} from "../model/card";
import LCCardView from "./card";
import Grid from "@material-ui/core/Grid";
import {Box} from "@material-ui/core";

const useStyles = makeStyles<Theme, LCHandProp>({
    hand: {
        userSelect: "none",
        display: "inline-flex",
        width: props => props.cards.length * 35 + 50,
        height: 150
    },
    horizontal: {
        width: 35,
    },
    selected: {
        position: "relative",
        top: -10,
    }
});

type LCHandProp = {
    cards: LCCard[]
    unknown?: boolean,
    selected?: LCCard[]
    onClick?: (card: LCCard) => void
}

const LCHandView: React.FunctionComponent<LCHandProp> = (props) => {
    console.log(props.cards);

    const classes = useStyles(props);

    return (
        <Grid container className={classes.hand}>
            {(props.cards.map((c, i) => {
                return (
                    <Grid item className={classes.horizontal}
                          key={i} onClick={e => props.onClick && props.onClick(c)}>
                        <Box className={(props.selected?.indexOf(c) || -1) > -1 ? classes.selected : ""}>
                            <LCCardView card={c} unknown={props.unknown}/>
                        </Box>
                    </Grid>
                )
            }))}
        </Grid>
    )
};

export default LCHandView;