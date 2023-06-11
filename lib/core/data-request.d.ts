import { Action } from 'me-actions';
import { IDLContext } from '../context';
export default class extends Action {
    private timeout;
    private thread;
    protected doStart(context: IDLContext): Promise<void>;
    protected doStop(context: IDLContext): void;
}
