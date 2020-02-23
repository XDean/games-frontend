import React, {ReactNode} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

export interface SelectDialogProps {
    title?: string,
    options: (string | ReactNode)[]
    onSelect: (index: number) => void
}

export function SelectDialog(props: SelectDialogProps) {

    return (
        <Dialog open>
            {props.title && <DialogTitle>{props.title}</DialogTitle>}
            <List>
                {props.options.map((o, i) => (
                    <ListItem button onClick={() => props.onSelect(i)} key={i}>
                        {o}
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}