import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Box, Paper} from "@material-ui/core";
import {LCCard} from "../model/card";
import {cardColor} from "./style";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";


const useStyles = makeStyles<Theme, LCMiniCardProp>({
        card: {
            position: "relative",
            height: 35,
            width: 35,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
            backgroundColor: props => cardColor(props.card.color),
        },
        center: {
            height: 35,
            lineHeight: "32px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 27,
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
        double: {
            fontSize: 25,
        }
    }
);

type LCMiniCardProp = {
    card: LCCard,
}

const LCMiniCardView: React.FunctionComponent<LCMiniCardProp> = (props) => {

    const classes = useStyles(props);
    const point = props.card.point === "double" ? <FontAwesomeIcon icon={faHandshake}/> : props.card.point;

    return (
        <Paper className={classes.card} elevation={3}>{
            <Box className={classes.center}>
                {point}
            </Box>
        }
        </Paper>
    )
};

export default LCMiniCardView;