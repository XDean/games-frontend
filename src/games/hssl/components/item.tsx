import React from 'react';
import {HSSLItem} from "../model/game";
import {createStyles, makeStyles, Paper} from "@material-ui/core";
import {HSSLTheme} from "../theme";

const useStyles = makeStyles<typeof HSSLTheme, HSSLItemProp>(theme => createStyles({
    item: props => ({
        minHeight: 55,
        minWidth: 36,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundSize: "cover",
        backgroundImage: `url(${theme.itemStyle(props.item).image})`,
    }),
}));

type HSSLItemProp = {
    item: HSSLItem
}

const HSSLItemView: React.FunctionComponent<HSSLItemProp> = (props) => {
    const classes = useStyles(props);

    return (
        <Paper className={classes.item} elevation={1}/>
    )
};

export default HSSLItemView;