import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import LCHandView from "./hand";
import {LCCard} from "../model/model";

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
            <LCHandView cards={[
                new LCCard("unknown"),
                new LCCard(1, "double"),
                new LCCard(2, 2)
            ]} onPlayCard={c=>{
                console.log(c)
            }}/>
        </Box>
    )
};

export default LCBoard;