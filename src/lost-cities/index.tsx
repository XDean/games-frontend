import React, {useState} from 'react';
import CreatePane from "../components/create";
import LCBoardView from "./component/board";
import {Box, CircularProgress, makeStyles, Snackbar} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import {Alert} from "../components/snippts";
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles({
    backdrop: {
        zIndex: 10,
        color: '#fff',
    },
});

type CreatePaneProp = {}

const LCEntryPage: React.FunctionComponent<CreatePaneProp> = (props) => {
    const classes = useStyles();

    let [id, setId] = useState("");
    let [connecting, setConnecting] = useState(false);
    let [error, setError] = useState("");

    if (id === "") {
        return (
            <React.Fragment>
                <CreatePane game={"lostcities"} onCreate={() => {
                    setConnecting(true);
                    fetch("api/game/lostcities", {
                        method: "POST",
                    }).then(res => {
                        setConnecting(false);
                        if (res.ok) {
                            res.json().then(body => {
                                setId(body["id"]);
                            })
                        } else {
                            throw new Error(`${res.status} ${res.statusText}`);
                        }
                    }).catch(e => {
                        setConnecting(false);
                        setError(`创建游戏失败：${e.toString()}`)
                    })
                }} onJoin={(id) => {
                    setId(id)
                }}/>
                <Snackbar open={error !== ""} transitionDuration={0} onClose={() => setError("")}>
                    <Alert severity={"error"}>
                        {error}
                    </Alert>
                </Snackbar>
                <Backdrop open={connecting} className={classes.backdrop}>
                    <CircularProgress color="inherit"/>
                    <Box>
                        正在连接
                    </Box>
                </Backdrop>
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