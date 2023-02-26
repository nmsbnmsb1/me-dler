import { Action } from 'me-actions';
import { IDLContext } from '../context';
export declare function writeMeta({ dl }: IDLContext): void;
export default class extends Action {
    protected doStart(context: IDLContext): Promise<void>;
}
