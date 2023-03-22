/// <reference types="node" />
import { EventEmitter } from "events";
import { IParsedRequest } from "../";
import { ICurrencyManager } from "@requestnetwork/currency";
interface IBalanceEvents {
    finished: () => void;
    update: (request: IParsedRequest) => void;
}
export declare class BalanceEventEmitter extends EventEmitter {
    private _untypedOn;
    private _untypedEmit;
    on: <K extends keyof IBalanceEvents>(event: K, listener: IBalanceEvents[K]) => this;
    emit: <K extends keyof IBalanceEvents>(event: K, ...args: Parameters<IBalanceEvents[K]>) => boolean;
}
export declare const useListRequests: () => (account: string, network: string | number, isSmartContract?: boolean) => Promise<{
    requests: IParsedRequest[];
    loadBalances: () => Promise<void>;
    on: <K extends keyof IBalanceEvents>(event: K, listener: IBalanceEvents[K]) => this;
}>;
export declare const listRequests: (account: string, network: string | number, isSmartContract: boolean | undefined, currencyManager: ICurrencyManager) => Promise<{
    requests: IParsedRequest[];
    loadBalances: () => Promise<void>;
    on: <K extends keyof IBalanceEvents>(event: K, listener: IBalanceEvents[K]) => this;
}>;
export {};
