import { Action } from 'me-actions';
import { IDLContext } from '../context';
export default class extends Action {
    private timer;
    protected doStart({ dl }: IDLContext): Promise<void>;
    protected doStop(): void;
}
