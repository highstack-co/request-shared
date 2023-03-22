import { ethers, providers } from "ethers";
export declare class ENS {
    name: string;
    private provider?;
    private resolver?;
    private nodehash;
    static registryAddress: string;
    static resolve(address: string, provider?: providers.Provider): Promise<string | null>;
    static fromAddress(address: string, provider?: providers.Provider): Promise<ENS | null>;
    constructor(name: string, provider?: ethers.providers.Provider | undefined);
    private getResolver;
    addr(): Promise<string | undefined>;
    text(key: string): Promise<string | undefined>;
}
export declare const isValidEns: (val: string) => boolean;
export declare const useEnsName: (address: string | null | undefined, { disabled, timeout }?: {
    disabled?: boolean | undefined;
    timeout?: number | undefined;
}) => [string | undefined, {
    loading: boolean;
}];
