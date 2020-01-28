import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CreatePane from "../components/create";
import LCBoardView from "./component/board";
import {Box} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import {connectLC} from "./fetch/fetch";

const useStyles = makeStyles({});

type CreatePaneProp = {}

const LCEntryPage: React.FunctionComponent<CreatePaneProp> = (props) => {
    let [id, setId] = useState("");

    if (id === "") {
        return (
            <CreatePane game={"lostcities"} onCreate={() => {
                fetch("api/game/lostcities", {
                    method: "POST",
                }).then(res => {
                    if (res.ok) {
                        res.json().then(body => {
                            setId(body["id"]);
                        })
                    }
                })
            }} onJoin={(id) => {
                setId(id)
            }}>
                <div>

                </div>
            </CreatePane>
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
                <LCBoardView id={id}/>
            </Box>
        )
    }
};

export default LCEntryPage;