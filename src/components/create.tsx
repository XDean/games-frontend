import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Button, Paper, TextField} from "@material-ui/core";
import {useHistory} from "react-router";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    card: {},
    media: {
        width: 350,
        height: 180,
    },
});

type CreatePaneProp = {
    game: string,
    onCreate: () => void,
    onJoin: (id: string) => void,
}

const CreatePane: React.FunctionComponent<CreatePaneProp> = (props) => {
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
            <Box>
                <Paper elevation={3}>
                    <Button onClick={() => setCreate(true)}>
                        创建游戏
                    </Button>
                </Paper>
                <Paper elevation={3}>
                    <Button onClick={() => setJoin(true)}>
                        加入游戏
                    </Button>
                </Paper>
            </Box>
        );
    }
};

export default CreatePane;