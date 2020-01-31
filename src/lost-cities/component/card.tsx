import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Box, Paper} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {LCCard, LCCardColor, LCCardPoint} from "../model/model";

export function cardColor(color: LCCardColor) {
    switch (color) {
        case "unknown":
            return "#999";
        case 0:
            return "#faa";
        case 1:
            return "#fff";
        case 2:
            return "#0f0";
        case 3:
            return "#0ff";
        case 4:
            return "#ff0";
    }
}

export function cardPoint(point?: LCCardPoint, doubleClass?: string) {
    if (point === undefined) {
        return "";
    } else {
        return point === "double" ? <FontAwesomeIcon className={doubleClass} icon={faHandshake}/> : point;
    }
}

const useStyles = makeStyles<Theme, CardProp>({
        card: {
            position: "relative",
            height: props => props.mini ? 35 : 150,
            width: props => props.mini ? 35 : 85,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
            backgroundColor: props => cardColor(props.card.color),
        },
        center: props => props.mini ? {
            height: 35,
            lineHeight: "32px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 27,
        } : {
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
        rightBottom: props => props.mini ? {
            display: "none",
        } : {
            right: 3,
            bottom: 3,
        },
        double: props => props.mini ? {
            fontSize: 25,
        } : {}
    }
);

type CardProp = {
    card: LCCard,
    mini?: boolean,
}

const LCCardView: React.FunctionComponent<CardProp> = (props) => {

    const classes = useStyles(props);
    const point = props.card.point === undefined ? "" : cardPoint(props.card.point, classes.double);

    if (props.mini) {
        return (
            <Paper className={classes.card} elevation={3}>{
                props.card.color === "unknown" ?
                    <Box className={classes.center}>
                        背
                    </Box> :
                    <Box className={classes.center}>
                        {point}
                    </Box>
            }
            </Paper>
        )
    } else if (props.card.color === "unknown") {
        return (
            <Paper className={classes.card} elevation={3}>
                <Box className={classes.center}>
                    背
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