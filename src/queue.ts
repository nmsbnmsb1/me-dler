import { ErrHandler, RunQueue } from 'me-actions';
import { DLContext } from './context';
import { Downloader } from './downloader';

export class DLQueue extends RunQueue {
	private static _ref = 0;
	private static _instance: DLQueue;

	public static ref() {
		DLQueue._ref++;
		if (!DLQueue._instance) {
			DLQueue._instance = new DLQueue(5, RunQueue.StopHandlerManual, ErrHandler.Ignore);
			DLQueue._instance.start();
		}
		return DLQueue._instance;
	}
	public static unref() {
		DLQueue._ref--;
		//
		if (DLQueue._ref <= 0) {
			if (DLQueue._instance) {
				DLQueue._instance.stop();
				DLQueue._instance = undefined;
			}
			return true;
		}
		//
		return false;
	}
	public getDL = (context: DLContext) => new Downloader(context);
}
