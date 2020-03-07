import React from 'react';
import {HSSLCard} from "../model/game";
import {createStyles, makeStyles, Paper} from "@material-ui/core";

const useStyles = makeStyles(theme => createStyles({
    card: {
        height: 115,
        width: 75,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundSize: "cover",
    },
    card0: {
        background: "#222",
    },
    card1: {
        background: "#ff0",
    },
    card2: {
        background: "#2d2",
    },
    card3: {
        background: "#dee",
    },
    card4: {
        background: "#f00",
    },
    card5: {
        background: "#f0f",
    },
    empty: {
        background: "#aaa",
    }
}));

type HSSLCardProp = {
    card: HSSLCard
}

const HSSLCardView: React.FunctionComponent<HSSLCardProp> = (props) => {
    const classes = useStyles();
    let styleClass;
    switch (props.card) {
        case 0:
            styleClass = classes.card0;
            break;
        case 1:
            styleClass = classes.card1;
            break;
        case 2:
            styleClass = classes.card2;
            break;
        case 3:
            styleClass = classes.card3;
            break;
        case 4:
            styleClass = classes.card4;
            break;
        case 5:
            styleClass = classes.card5;
            break;
        case "empty":
            styleClass = classes.empty;
            break;
    }

    return (
        <Paper className={`${styleClass} ${classes.card}`} elevation={1}/>
    )
};

export default HSSLCardView;