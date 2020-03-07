import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";

const useStyles = makeStyles({});

type HSSLBoardProp = {}

const HSSLBoardView: React.FunctionComponent<HSSLBoardProp> = (props) => {
    const classes = useStyles();
    return (
        <Box>
            Board
        </Box>
    )
};

export default HSSLBoardView;