import { Action } from 'me-actions';
import { IDLContext } from '../context';
export default class extends Action {
    private timeout;
    private request;
    protected doStart(context: IDLContext): Promise<void>;
    protected doStop(context: IDLContext): void;
}
