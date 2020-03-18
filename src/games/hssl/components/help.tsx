import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Divider, Paper, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => createStyles({
    title: {
        padding: theme.spacing(1, 2),
    },
    content: {
        padding: theme.spacing(2),
        overflowY: "auto",
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

type HSSLHelpProp = {
    onClose: () => void
}

const HSSLHelpView: React.FunctionComponent<HSSLHelpProp> = (props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant={"h3"} className={classes.title}>
                失落的城市
            </Typography>
            <IconButton className={classes.closeButton} onClick={props.onClose}>
                <CloseIcon/>
            </IconButton>
            <Divider/>
            <Paper className={classes.content}>
                <Typography>
                    人数： 2人
                </Typography>
            </Paper>
        </React.Fragment>
    )
};

export default HSSLHelpView;