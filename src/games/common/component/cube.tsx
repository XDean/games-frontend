import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Color} from "csstype";
import {AppTheme} from "../../../theme";

const useStyles = makeStyles<typeof AppTheme, CubeProp>(theme => createStyles({
    wrap: props => ({
        width: props.size * 1.5,
        height: props.size * 1.5,
        perspective: props.size * 4,
    }),
    cube: props => ({
        width: props.size,
        height: props.size,
        position: "relative",
        transformStyle: "preserve-3d",
        transform: `rotateX(-35deg) rotateY(35deg) translateX(${props.size * 0.3}px) translateY(${props.size * 0.37}px)`,
        "& div": {
            position: "absolute",
            width: props.size,
            height: props.size,
            border: `${props.borderColor} solid .1px`,
        },
    }),
    back: props => ({
        transform: `rotateY(180deg) translateZ(-${props.size / 2}px)`,
        background: props.color,
    }),
    right: props => ({
        transform: `rotateY(-270deg) translateX(${props.size / 2}px)`,
        transformOrigin: "top right",
        background: props.color,
    }),
    left: props => ({
        transform: `rotateY(270deg) translateX(-${props.size / 2}px)`,
        transformOrigin: "center left",
        background: props.color,
    }),
    top: props => ({
        transform: `rotateX(-90deg) translateY(-${props.size / 2}px)`,
        transformOrigin: "top center",
        background: props.color,
    }),
    bottom: props => ({
        transform: `rotateX(90deg) translateY(${props.size / 2}px)`,
        transformOrigin: "bottom center",
        background: props.color,
    }),
    front: props => ({
        transform: `translateZ(${props.size / 2}px)`,
        background: props.color,
    }),
}));

type CubeProp = {
    size: number,
    color: Color
    borderColor: Color
}

const CubeView: React.FunctionComponent<CubeProp> = (props) => {
    const classes = useStyles(props);
    return (
        <div className={classes.wrap}>
            <div className={classes.cube}>
                <div className={classes.front}/>
                <div className={classes.back}/>
                <div className={classes.top}/>
                <div className={classes.bottom}/>
                <div className={classes.left}/>
                <div className={classes.right}/>
            </div>
        </div>
    )
};

export default CubeView;