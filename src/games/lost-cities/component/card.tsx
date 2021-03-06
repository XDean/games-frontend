import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Paper} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {LCCard} from "../model/card";
import {LCTheme} from "../theme";

const useStyles = makeStyles<typeof LCTheme, CardProp>((theme) => createStyles({
        card: props => ({
            position: "relative",
            height: 150,
            width: 85,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
            background: theme.cardBackground(props.unknown ? "unknown" : props.card!.color, "card"),
            backgroundSize: "cover",
        }),
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
                if (props.card && props.card.isDouble()) {
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
        },
    })
);

type CardProp = {
    unknown?: boolean
    card?: LCCard
    className?:string,
}

const LCCardView: React.FunctionComponent<CardProp> = (props) => {
    const classes = useStyles(props);
    if (props.unknown) {
        return (
            <Paper className={classes.card+" "+props.className} elevation={3}>
                <Box className={classes.center}>
                </Box>
            </Paper>
        )
    } else {
        let point = props.card!.isDouble() ? <FontAwesomeIcon icon={faHandshake}/> : props.card!.point;
        return (
            <Paper className={classes.card+" "+props.className} elevation={3}>
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