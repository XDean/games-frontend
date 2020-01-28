import {Property} from "xdean-util";
import {Dispatch, SetStateAction, useState} from "react";

export function useStateByProp<S>(p: Property<S>): [S, Dispatch<SetStateAction<S>>] {
    let [state, setState] = useState(p.value);
    p.addListener((ob, o, n) => {
        setState(n);
    });
    return [state, setState]
}