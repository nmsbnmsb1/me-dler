import { Action } from 'me-actions';
import { DLContext } from '../context';
export default class extends Action {
    private timer;
    protected doStart(context: DLContext): Promise<void>;
    protected doStop(): Promise<void>;
}
