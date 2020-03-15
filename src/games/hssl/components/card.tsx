import React from 'react';
import {HSSLCard} from "../model/game";
import {Box, createStyles, makeStyles, Paper} from "@material-ui/core";
import {HSSLTheme} from "../theme";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles<typeof HSSLTheme, HSSLCardProp>(theme => createStyles({
    unknown: props => ({
        height: 115,
        width: 75,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundSize: "cover",
        backgroundImage: `url(${theme.cardStyle(props.card).image})`,
    }),
    card: props => {
        let colors = theme.cardStyle(props.card).color;
        return {
            height: 115,//450
            width: 75,//325
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
            background: `linear-gradient(${colors.primary} 30%, ${colors.secondary} 100%)`,
        }
    },
    title: props => ({
        color: theme.cardStyle(props.card).color.font,
        lineHeight: 1.5,
    }),
    image: props => ({
        width: 60,
        height: 85,
        backgroundSize: "138%",
        backgroundPositionX: -10,
        backgroundPositionY: -23,
        borderRadius: 5,
        margin: "auto",
        backgroundImage: `url(${theme.cardStyle(props.card).image})`,
    }),
}));

type HSSLCardProp = {
    card: HSSLCard
}

const HSSLCardView: React.FunctionComponent<HSSLCardProp> = (props) => {
    const classes = useStyles(props);
    if (props.card === -1) {
        return <Paper className={classes.unknown}/>
    } else {
        return (
            <Paper className={classes.card} elevation={1}>
                <Typography variant="subtitle1" className={classes.title}>
                    {HSSLTheme.cardStyle(props.card).name}
                </Typography>
                <Box className={classes.image}/>
            </Paper>
        )
    }
};

export default HSSLCardView;