import React, {useState} from 'react';
import CreatePane from "../components/create";
import LCBoardView from "./component/board";
import {Box, Snackbar} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import {Alert} from "../components/snippts";

// const useStyles = makeStyles({});

type CreatePaneProp = {}

const LCEntryPage: React.FunctionComponent<CreatePaneProp> = (props) => {
    let [id, setId] = useState("");
    let [error, setError] = useState("");

    if (id === "") {

        return (
            <React.Fragment>
                <CreatePane game={"lostcities"} onCreate={() => {
                    fetch("api/game/lostcities", {
                        method: "POST",
                    }).then(res => {
                        if (res.ok) {
                            res.json().then(body => {
                                setId(body["id"]);
                            })
                        } else {
                            throw `${res.status} ${res.statusText}`;
                        }
                    }).catch(e => {
                        setError(`创建游戏失败：${e.toString()}`)
                    })
                }} onJoin={(id) => {
                    setId(id)
                }}>
                    <div>

                    </div>
                </CreatePane>
                <Snackbar open={error !== ""} transitionDuration={0} onClose={() => setError("")}>
                    <Alert severity={"error"}>
                        {error}
                    </Alert>
                </Snackbar>
            </React.Fragment>
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