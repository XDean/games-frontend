import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Paper, PaperProps, Typography} from "@material-ui/core";
import {LCCard} from "../model/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {LCTheme} from "../theme";


const useStyles = makeStyles<typeof LCTheme, LCSquareProp>((theme) => createStyles({
        card: props=>({
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",

            position: "relative",
            height: 35,
            width: 35,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
            background: theme.cardBackground(props.unknown ? "unknown" : props.card.color, "square"),
        }),
        point: {
            fontSize: 27,
            fontWeight: "bold",
        },
        double: {
            fontSize: 25,
        }
    })
);

type LCSquareProp = {
    card: LCCard
    unknown?: boolean
    root?: Partial<PaperProps>
}

const LCSquareView: React.FunctionComponent<LCSquareProp> = (props) => {

    const classes = useStyles(props);
    const point = props.card.isDouble() ?
        <FontAwesomeIcon icon={faHandshake} className={classes.double}/> :
        <Typography className={classes.point}>{props.card.point}</Typography>;

    return (
        <Paper elevation={3}{...props.root} className={`${classes.card} ${props.root?.className}`}>
            {point}
        </Paper>
    )
};

export default LCSquareView;