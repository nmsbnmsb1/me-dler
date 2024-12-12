import { Action } from 'me-actions';
import { DLContext } from '../context';
export default class extends Action {
    protected doStart(context: DLContext): Promise<void>;
}
