import { Action } from 'me-actions';
import { IDLContext, IThread } from '../context';
export default class extends Action {
    private thread;
    private response;
    private onData;
    constructor(thread: IThread);
    protected doStart(context: IDLContext): Promise<void>;
    protected doStop(): void;
}
