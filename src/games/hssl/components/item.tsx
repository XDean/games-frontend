import React from 'react';
import {HSSLItem} from "../model/game";
import {createStyles, makeStyles, Paper} from "@material-ui/core";
import boat from "../resources/items/boat.jpg"
import guanshui from "../resources/items/guanshui.jpg"
import banyun from "../resources/items/banyun.jpg"
import biyue from "../resources/items/biyue.jpg"

const useStyles = makeStyles(theme => createStyles({
    item: {
        height: 55,
        width: 36,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundSize: "cover",
    },
    boat: {
        backgroundImage: `url(${boat})`,
    },
    guanshui: {
        backgroundImage: `url(${guanshui})`,
    },
    banyun: {
        backgroundImage: `url(${banyun})`,
    },
    biyue: {
        backgroundImage: `url(${biyue})`,
    },
}));

type HSSLItemProp = {
    item: HSSLItem
}

const HSSLItemView: React.FunctionComponent<HSSLItemProp> = (props) => {
    const classes = useStyles();
    let styleClass;
    switch (props.item) {
        case HSSLItem.Boat:
            styleClass = classes.boat;
            break;
        case HSSLItem.GuanShui:
            styleClass = classes.guanshui;
            break;
        case HSSLItem.BanYun:
            styleClass = classes.banyun;
            break;
        case HSSLItem.BiYue:
            styleClass = classes.biyue;
            break;
    }

    return (
        <Paper className={`${styleClass} ${classes.item}`} elevation={1}/>
    )
};

export default HSSLItemView;