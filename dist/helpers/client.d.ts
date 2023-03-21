import { CurrencyDefinition } from "@requestnetwork/currency";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
export declare const useRequestClient: (network: string, signatureProvider?: Types.SignatureProvider.ISignatureProvider | undefined) => RequestNetwork;
export declare const getRequestClient: (network: string, signatureProvider?: Types.SignatureProvider.ISignatureProvider | undefined, currencyList?: CurrencyDefinition<unknown>[] | undefined) => RequestNetwork;
