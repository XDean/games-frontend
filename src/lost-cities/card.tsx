import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles<Theme, CardProp>({
        card: {
            position: "relative",
            height: 150,
            width: 85,
            borderRadius: 5,
            borderColor: "#888",
            backgroundColor: props => {
                switch (props.color) {
                    case "unknown":
                        return "#999";
                    case 1:
                        return "#f00";
                    case 2:
                        return "#0f0";
                    case 3:
                        return "#00f";
                    case 4:
                        return "#ff0";
                    case 5:
                        return "#edd";
                }
            },
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
                if (props.point === "double") {
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
        rightBottom: {
            right: 3,
            bottom: 3,
        }
    }
);

type CardProp = {
    color: "unknown" | number,
    point?: "double" | number,
}

const LCCard: React.FunctionComponent<CardProp> = (props) => {

    const classes = useStyles(props);
    const point = props.point === "double" ? <FontAwesomeIcon icon={faHandshake}/> : props.point;

    if (props.color === "unknown") {
        return (
            <Box className={classes.card}>
                <Box className={classes.center}>
                    背
                </Box>
            </Box>
        )
    } else {
        return (
            <Box className={classes.card}>
                <Box className={`${classes.minorNumber} ${classes.leftTop}`}>
                    {point}
                </Box>
                <Box className={`${classes.minorNumber} ${classes.rightBottom}`}>
                    {point}
                </Box>
            </Box>
        )
    }
};

export default LCCard;