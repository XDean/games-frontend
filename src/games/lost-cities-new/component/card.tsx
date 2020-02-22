import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Paper} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {LCCard, LCCardPoint} from "../model/card";
import {LCTheme} from "../theme";

export function cardPoint(point?: LCCardPoint, doubleClass?: string) {
    if (point === undefined) {
        return "";
    } else {
        return point === "double" ? <FontAwesomeIcon className={doubleClass} icon={faHandshake}/> : point;
    }
}

const useStyles = makeStyles<typeof LCTheme, CardProp>((theme) => createStyles({
        card: {
            position: "relative",
            height: 150,
            width: 85,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
            backgroundColor: props => theme.cardBackground(props.unknown ? "unknown" : props.card.color, "card"),
        },
        center: {
            fontSize: 48,
            textAlign: "center",
            lineHeight: "150px",
            fontWeight: "bold",
        },
        minorNumber: {
            position: "absolute",
            height: 30,
            lineHeight: "30px",
            fontSize: props => {
                if (props.card.point === "double") {
                    return 20;
                } else {
                    return 30;
                }
            },
            textAlign: "center",
        },
        leftTop: {
            left: 3,
            top: 3,
        },
    })
);

type CardProp = {
    card: LCCard
    unknown?: boolean
}

const LCCardView: React.FunctionComponent<CardProp> = (props) => {

    const classes = useStyles(props);
    const point = props.card.point === "double" ? <FontAwesomeIcon icon={faHandshake}/> : props.card.point;

    if (props.unknown) {
        return (
            <Paper className={classes.card} elevation={3}>
                <Box className={classes.center}>
                </Box>
            </Paper>
        )
    } else {
        return (
            <Paper className={classes.card} elevation={3}>
                <Box className={`${classes.minorNumber} ${classes.leftTop}`}>
                    {point}
                </Box>
                <Box className={`${classes.minorNumber} ${classes.rightBottom}`}>
                    {point}
                </Box>
            </Paper>
        )
    }
};

export default LCCardView;