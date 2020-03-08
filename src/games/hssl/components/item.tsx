import React from 'react';
import {HSSLItem} from "../model/game";
import {createStyles, makeStyles, Paper} from "@material-ui/core";
import {HSSLTheme} from "../theme";

const useStyles = makeStyles<typeof HSSLTheme, HSSLItemProp>(theme => createStyles({
    item: props => ({
        height: 55,
        width: 36,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundSize: "cover",
        ...theme.itemStyle(props.item).card,
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