import {Property} from "xdean-util";
import {useEffect, useState} from "react";

export function useStateByProp<S extends (any | any[])>(p: Property<S>): S {
    let [state, setState] = useState<S>(() => p.value);
    useEffect(() => {
        setState(p.value);
        p.addListener((ob, o, n) => {
            setState(n.slice ? n.slice() : n);
        });
    }, [p]);
    return state
}


export function useStateByMapProp<S, V extends (any | any[])>(
    p: Property<S>,
    selector: (value: S) => V
): V {
    let [state, setState] = useState<V>(() => selector(p.value));
    useEffect(() => {
        setState(selector(p.value));
        p.addListener((ob, o, n) => {
            let newValue = selector(n);
            if (newValue !== state) {
                setState(newValue.slice ? newValue.slice() : n);
            }
        });
    }, [p]);
    return state
}