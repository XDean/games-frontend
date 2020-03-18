import {AlertProps} from "@material-ui/lab";
import MuiAlert from "@material-ui/lab/Alert/Alert";
import React from "react";
import Chip from "@material-ui/core/Chip";
import {grey} from "@material-ui/core/colors";

export function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function ShareRoom(props: { id: string }) {
    return (
        <Chip
            label={`房间号: ${props.id}`}
            clickable
            variant="outlined"
        />
    )
}