import { Action } from 'me-actions';
import type { DLContext } from '../context';
export declare function writeMeta(context: DLContext): Promise<void>;
export default class extends Action {
    protected doStart(context: DLContext): Promise<void>;
}
