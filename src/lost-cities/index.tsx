import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CreatePane from "../components/create";
import LCBoard from "./component/board";
import {Box} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';

const useStyles = makeStyles({});

type CreatePaneProp = {}

const LCEntryPage: React.FunctionComponent<CreatePaneProp> = (props) => {
    let [id, setId] = useState("");

    if (id == "") {
        return (
            <CreatePane game={"lostcities"} configPane={
                <div>

                </div>
            } onCreate={() => {
                fetch("/game/lostcities", {
                    method: "POST",
                }).then(res => {
                    if (res.ok) {
                        res.json().then(body => {
                            setId(body["id"])
                        })
                    }
                })
            }} onJoin={(id) => {

            }}/>
        )
    } else {
        return (
            <Box>
                <Chip
                    label={`房间号: ${id}`}
                    color="primary"
                    clickable
                    variant="outlined"
                    onDelete={() => {
                    }}
                    deleteIcon={<ShareOutlinedIcon/>}
                />
                <LCBoard id={id}/>
            </Box>
        )
    }
};

export default LCEntryPage;