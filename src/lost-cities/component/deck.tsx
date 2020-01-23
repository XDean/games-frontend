import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import {LCCard} from "../model/model";
import LCCardView from "./card";

const useStyles = makeStyles({});

type LCDeckProp = {}

const LCDeckView: React.FunctionComponent<LCDeckProp> = (props) => {
    return (
        <Box>
            <LCCardQueue cards={[
                new LCCard(1, "double"),
                new LCCard(2, 2),
                new LCCard(2, 3),
                new LCCard(3, 4),
            ]}/>
        </Box>
    )
};

export default LCDeckView;


const queueStyle = makeStyles({
    hand: {
        userSelect: "none",
    },
    horizontalCard: {
        height: 35,
    }
});

type LCCardQueueProp = {
    cards: LCCard[]
}


const LCCardQueue: React.FunctionComponent<LCCardQueueProp> = (props) => {
    const classes = queueStyle();

    return (
        <div className={classes.hand}>
            {
                props.cards.map((c, i) => {
                    return (
                        <div className={classes.horizontalCard} key={i} onDoubleClick={e => {
                            e.preventDefault();
                        }}>
                            <LCCardView card={c}/>
                        </div>
                    )
                })
            }
        </div>
    )
};