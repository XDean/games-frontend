import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Container} from "@material-ui/core";
import JgzqCard from "./components/JgzqCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingTop: 30,
        },
    }),
);

const Jgzq: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <Container fixed className={classes.root}>
            <JgzqCard/>
        </Container>
    );
};

export default Jgzq