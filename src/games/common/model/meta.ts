import {FunctionComponent, ReactNode} from "react";

export interface GameMeta {
    readonly id: string
    readonly name: string
    readonly boardCard: FunctionComponent
    readonly mainNode: FunctionComponent
    readonly headerNode?: FunctionComponent
}