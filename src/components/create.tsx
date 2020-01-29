import React from 'react';
import {Button, makeStyles, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    container: {
        width: "100%",
        height: "100%",
        margin: "auto",
    }
});

type CreatePaneProp = {
    game: string,
    onCreate: () => void,
    onJoin: (id: string) => void,
}

const CreatePane: React.FunctionComponent<CreatePaneProp> = (props) => {
    const classes = useStyles();
    let [id, setId] = React.useState("");
    let [create, setCreate] = React.useState(false);
    let [join, setJoin] = React.useState(false);

    if (create) {
        return <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {props.children}
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={() => setCreate(false)}>
                        返回
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={() => props.onCreate()}>
                        确定
                    </Button>
                </Grid>
            </Grid>
        </div>
    } else if (join) {
        return <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField id="join-id" label="房间号" onChange={e => setId(e.target.value)}/>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={() => setJoin(false)}>
                        返回
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={() => props.onJoin(id)}>
                        确定
                    </Button>
                </Grid>
            </Grid>
        </div>
    } else {
        return (
            <Grid container className={classes.container}
                  justify="center"
                  alignItems="center">
                <Grid item xs={6}>
                    <Button
                        style={{float: "right"}}
                        color={"primary"} variant={"contained"} onClick={() => {
                        if (props.children) {
                            setCreate(true);
                        } else {
                            props.onCreate();
                        }
                    }}>
                        创建游戏
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button color={"primary"} variant={"outlined"} onClick={() => setJoin(true)}>
                        加入游戏
                    </Button>
                </Grid>
            </Grid>
        );
    }
};

export default CreatePane;