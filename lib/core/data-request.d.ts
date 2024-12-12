import { Action } from 'me-actions';
import { DLContext } from '../context';
export default class extends Action {
    private timeout;
    private thread;
    protected doStart(context: DLContext): Promise<void>;
    protected doStop(context: DLContext): Promise<void>;
}
