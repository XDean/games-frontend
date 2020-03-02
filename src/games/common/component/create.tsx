import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Box, Button, CircularProgress, Grid, Snackbar, Tab, Tabs, TextField} from "@material-ui/core";
import {Alert} from "../../../components/snippts";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";

const useStyles = makeStyles({
    content: {
        padding: 10,
    },
    buttonBar: {
        padding: 10,
    },
    backdrop: {
        zIndex: 99999,
        color: '#fff',
    },
});

type CreateJoinRoomProps = {
    connecting?: boolean
    error?: string,
    onCreate(): void
    onJoin(id: string): void
    onClose(): void
}

const CreateJoinRoomView: React.FunctionComponent<CreateJoinRoomProps> = (props) => {
    const classes = useStyles();
    const [id, setId] = React.useState("");
    const [value, setValue] = React.useState(0);

    function onConfirm() {
        if (value === 0) {
            props.onCreate();
        } else {
            props.onJoin(id);
        }
    }

    return (
        <Box>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, v) => setValue(v)}>
                    <Tab label="创建游戏"/>
                    <Tab label="加入游戏"/>
                </Tabs>
            </AppBar>
            <Grid container className={classes.content} justify={"center"} alignItems={"center"}>
                <Grid item hidden={value !== 0}>
                    {props.children}
                </Grid>
                <Grid item hidden={value !== 1}>
                    <TextField label="房间号" onChange={e => setId(e.target.value)}/>
                </Grid>
            </Grid>
            <Grid container
                  className={classes.buttonBar}
                  justify="space-evenly">
                <Grid item>
                    <Button color={"primary"} variant={"outlined"} onClick={onConfirm}>
                        确定
                    </Button>
                </Grid>
                <Grid item>
                    <Button color={"primary"} variant={"outlined"} onClick={props.onClose}>
                        取消
                    </Button>
                </Grid>
            </Grid>
            {props.error && <Snackbar open transitionDuration={0}>
                <Alert severity={"error"}>
                    {props.error}
                </Alert>
            </Snackbar>}
            {props.connecting && <Backdrop open className={classes.backdrop}>
                <CircularProgress color="inherit"/>
                <Box style={{padding: 10}}>
                    正在连接
                </Box>
            </Backdrop>}
        </Box>
    )
};

export default CreateJoinRoomView;