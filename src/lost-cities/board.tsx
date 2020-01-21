import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import LCCard from "./card";
import Chip from '@material-ui/core/Chip';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';

const useStyles = makeStyles({});

type BoardProp = {
    id: string
}

const LCBoard: React.FunctionComponent<BoardProp> = (props) => {

    return (
        <Box>
            <Chip
                label={`房间号: ${props.id}`}
                color="primary"
                clickable
                variant="outlined"
                onDelete={() => {
                }}
                deleteIcon={<ShareOutlinedIcon/>}
            />
            <LCCard color={"unknown"}/>
            <LCCard color={1} point={"double"}/>
            <LCCard color={2} point={2}/>
        </Box>
    )
};

export default LCBoard;