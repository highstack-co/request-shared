import { CurrencyDefinition } from "@requestnetwork/currency";
import { RequestLogicTypes, ClientTypes } from "@requestnetwork/types";
import { providers } from "ethers";
export type RequestStatus = "paid" | "open" | "pending" | "canceled" | "overpaid" | "waiting";
/** Formatted request */
export interface IParsedRequest {
    requestId: string;
    amount: number;
    balance: number;
    currency: CurrencyDefinition;
    status: RequestStatus;
    createdDate: Date;
    paidDate?: Date;
    canceledDate?: Date;
    paymentAddress: string;
    paymentFrom?: string;
    paymentTxHash?: string;
    invoiceNumber?: string;
    reason?: string;
    currencyType: RequestLogicTypes.CURRENCY;
    currencySymbol: string;
    currencyNetwork: string;
    txHash?: string;
    payee: string;
    payer?: string;
    raw: ClientTypes.IRequestData;
    network: string;
    loaded?: boolean;
}
export * from "./contexts/RequestContext";
export * from "./contexts/CurrencyContext";
export * from "./hooks/useRate";
export * from "./helpers";
export type ChainInfo = {
    id: string;
    chainId: number;
    name: string;
    color?: string;
    isTest?: boolean;
    rpcUrls?: string[];
    nativeCurrency?: {
        name: string;
        symbol: string;
        decimals: number;
    };
    blockExplorerUrls?: string[];
};
export declare const chainInfos: Record<string | number, ChainInfo>;
export declare const addEthereumChain: (chain: string | number, library?: providers.Web3Provider) => Promise<any> | null;
