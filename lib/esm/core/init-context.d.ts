import { Action } from 'me-actions';
import { IDLContext } from '../context';
export default class extends Action {
    protected doStart(context: IDLContext): Promise<void>;
}
