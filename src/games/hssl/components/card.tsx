import React from 'react';
import {HSSLCard} from "../model/game";
import {createStyles, makeStyles, Paper} from "@material-ui/core";
import {HSSLTheme} from "../theme";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles<typeof HSSLTheme, HSSLCardProp>(theme => createStyles({
    card: props => ({
        height: 115,
        width: 75,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundSize: "cover",
        ...theme.cardStyle(props.card).card,
    }),
    title: props => ({
        color: theme.cardStyle(props.card).color.font,
    }),
}));

type HSSLCardProp = {
    card: HSSLCard
}

const HSSLCardView: React.FunctionComponent<HSSLCardProp> = (props) => {
    const classes = useStyles(props);
    return (
        <Paper className={classes.card} elevation={1}>
            <Typography variant="subtitle1" className={classes.title}>
                {HSSLTheme.cardStyle(props.card).name}
            </Typography>
        </Paper>
    )
};

export default HSSLCardView;