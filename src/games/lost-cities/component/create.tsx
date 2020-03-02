import React, {useState} from 'react';
import {useHistory} from "react-router";
import {LCMeta} from "../meta";
import CreateJoinRoomView from "../../common/component/create";

type LCCreateProp = {
    onClose(): void
}

const LCCreateView: React.FunctionComponent<LCCreateProp> = (props) => {
    const history = useHistory();

    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState("");

    function onCreate() {
        setConnecting(true);
        fetch("api/game/lostcities", {
            method: "POST",
        }).then(res => {
            setConnecting(false);
            if (res.ok) {
                res.json().then(body => {
                    history.push(`/game/${LCMeta.id}/${body["id"]}`);
                })
            } else {
                throw new Error(`${res.status} ${res.statusText}`);
            }
        }).catch(e => {
            setConnecting(false);
            setError(`创建游戏失败：${e.toString()}`)
        })
    }

    function onJoin(id: string) {
        history.push(`/game/${LCMeta.id}/${id}`);
    }

    return (
        <CreateJoinRoomView connecting={connecting} onCreate={onCreate} onJoin={onJoin} onClose={props.onClose}
                            error={error}>
            创建标准双人游戏
        </CreateJoinRoomView>
    );
};

export default LCCreateView;