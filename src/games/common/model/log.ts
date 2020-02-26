import {SimpleProperty} from "xdean-util";

export class LogPlugin<T> {
    readonly messages = new SimpleProperty<T[]>([]);

    log = (msg: T) => {
        this.messages.update(ms => {
            ms.push(msg)
        })
    }
}