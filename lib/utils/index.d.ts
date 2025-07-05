export * from './errs';
export * from './http';
export declare function getFileType(p: string): Promise<'not-exist' | 'file' | 'directory'>;
export declare function isExists(p: string): Promise<boolean>;
