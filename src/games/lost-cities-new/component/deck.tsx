import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Typography} from "@material-ui/core";
import LCCardView from "./card";

const useStyles = makeStyles({
    root: {
        position: "relative",
        boxShadow: "4px 4px 0px 2px #333",
    }
});

type LCDeckProp = {
    count: number,
}

const LCDeckView: React.FunctionComponent<LCDeckProp> = (props) => {
    const classes = useStyles();
    return (
        <Box>
            <Typography>
                牌库剩余：{props.count}
            </Typography>
            <LCCardView unknown className={classes.root}/>
        </Box>
    )
};

export default LCDeckView;