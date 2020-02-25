import {Property} from "xdean-util";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

export function useStateByProp<S extends (any | any[])>(p: Property<S>): [S, Dispatch<SetStateAction<S>>] {
    let [state, setState] = useState<S>(() => p.value);
    useEffect(() => {
        setState(p.value);
        p.addListener((ob, o, n) => {
            setState(n.slice ? n.slice() : n);
        });
    }, [p]);
    return [state, setState]
}