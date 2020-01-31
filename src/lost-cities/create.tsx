import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Box, Button, CircularProgress, Dialog, Grid, Snackbar, Tab, Tabs, TextField} from "@material-ui/core";
import {Alert} from "../components/snippts";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {useHistory} from "react-router";

const useStyles = makeStyles({
    content: {
        padding: 10,
    },
    buttonbar: {
        padding: 10,
    },
    backdrop: {
        zIndex: 99999,
        color: '#fff',
    },
});

type LCCreateProp = {
    onClose(): void
}

const LCCreateView: React.FunctionComponent<LCCreateProp> = (props) => {
    const history = useHistory();

    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [id, setId] = React.useState("");
    const [value, setValue] = React.useState(0);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState("");

    function submit() {
        if (value === 0) {
            setConnecting(true);
            fetch("api/game/lostcities", {
                method: "POST",
            }).then(res => {
                setConnecting(false);
                if (res.ok) {
                    res.json().then(body => {
                        history.push(`/game/lc/${body["id"]}`);
                    })
                } else {
                    throw new Error(`${res.status} ${res.statusText}`);
                }
            }).catch(e => {
                setConnecting(false);
                setError(`创建游戏失败：${e.toString()}`)
            })
        } else {
            history.push(`/game/lc/${id}`);
        }
    }

    return (
        <Dialog open={open} onClose={props.onClose}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, v) => setValue(v)}
                    aria-label="disabled tabs example"
                >
                    <Tab label="创建游戏"/>
                    <Tab label="加入游戏"/>
                </Tabs>
            </AppBar>
            <Grid container className={classes.content} justify={"center"} alignItems={"center"}>
                <Grid item hidden={value !== 0}>
                    创建标准的二人游戏
                </Grid>
                <Grid item hidden={value !== 1}>
                    <TextField label="房间号" onChange={e => setId(e.target.value)}/>
                </Grid>
            </Grid>
            <Grid container
                  className={classes.buttonbar}
                  justify="space-evenly">
                <Grid item>
                    <Button color={"primary"} variant={"outlined"} onClick={() => submit()}>
                        确定
                    </Button>
                </Grid>
                <Grid item>
                    <Button color={"primary"} variant={"outlined"} onClick={() => {
                        setOpen(false);
                        props.onClose();
                    }}>
                        取消
                    </Button>
                </Grid>
            </Grid>
            <Snackbar open={error !== ""} transitionDuration={0} onClose={() => setError("")}>
                <Alert severity={"error"}>
                    {error}
                </Alert>
            </Snackbar>
            <Backdrop open={connecting} className={classes.backdrop}>
                <CircularProgress color="inherit"/>
                <Box style={{padding: 10}}>
                    正在连接
                </Box>
            </Backdrop>
        </Dialog>
    )
};

export default LCCreateView;