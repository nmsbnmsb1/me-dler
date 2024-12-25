import { Action } from "me-actions";
import type { DLContext, DLThread } from "../context";
export default class extends Action {
    private thread;
    private response;
    private lnMap;
    constructor(thread: DLThread);
    protected doStart(context: DLContext): Promise<void>;
    protected doStop(): Promise<void>;
}
