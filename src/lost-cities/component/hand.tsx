import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {LCCard} from "../model/model";
import LCCardView from "./card";

const useStyles = makeStyles({
    hand: {
        userSelect: "none",
    },
    cardWrapper: {
        display: "inline-block",
        width: 30,
        verticalAlign: "bottom",
        "&:hover": {
            width: 85,
        }
    }
});

type HandProp = {
    cards: LCCard[]
    onPlayCard: (card: LCCard) => void,
}

const LCHand: React.FunctionComponent<HandProp> = (props) => {

    const classes = useStyles();

    return (
        <div className={classes.hand}>
            {
                props.cards.map((c, i) => {
                    return (
                        <div className={classes.cardWrapper} key={i} onDoubleClick={e => {
                            e.preventDefault();
                            props.onPlayCard(c)
                        }}>
                            <LCCardView card={c}/>
                        </div>
                    )
                })
            }
        </div>
    )
};

export default LCHand;