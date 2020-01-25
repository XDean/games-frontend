import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Box, Paper} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {LCCard} from "../model/model";

const useStyles = makeStyles<Theme, CardProp>({
        card: {
            position: "relative",
            height: props => props.mini ? 35 : 150,
            width: props => props.mini ? 35 : 85,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
            backgroundColor: props => {
                switch (props.card.color) {
                    case "unknown":
                        return "#999";
                    case 0:
                        return "#edd";
                    case 1:
                        return "#f00";
                    case 2:
                        return "#0f0";
                    case 3:
                        return "#0ff";
                    case 4:
                        return "#ff0";
                }
            },
        },
        center: props => props.mini ? {
            height: 35,
            lineHeight: "30px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 30,
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
        double: props=>props.mini?{
            fontSize: 25,
        }:{}
    }
);

type CardProp = {
    card: LCCard,
    mini?: boolean,
}

const LCCardView: React.FunctionComponent<CardProp> = (props) => {

    const classes = useStyles(props);
    const point = props.card.point === "double" ?
        <FontAwesomeIcon className={classes.double} icon={faHandshake}/> : props.card.point;

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