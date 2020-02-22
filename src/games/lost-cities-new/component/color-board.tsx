import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import {LCBoard} from "../model/board";
import {LCCardColor} from "../model/card";

const useStyles = makeStyles({});

type LCColorBoardProp = {
    board: LCBoard
    color: LCCardColor
}

const LCColorBoardView: React.FunctionComponent<LCColorBoardProp> = (props) => {
    return (
        <Box>
            <Box>

            </Box>
            <Box>

            </Box>
            <Box>

            </Box>
        </Box>
    )
};

export default LCColorBoardView;