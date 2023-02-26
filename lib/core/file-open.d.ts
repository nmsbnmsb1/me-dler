import { Action } from 'me-actions';
import { IDLContext } from '../context';
export default class extends Action {
    protected doStart({ dl }: IDLContext): Promise<void>;
}
