import React from "react";
import { CurrencyDefinition } from "@requestnetwork/currency";
import { IParsedRequest } from "../";
interface IContext {
    /** true if first fetch is ongoing */
    loading: boolean;
    /** the fetched request */
    request?: IParsedRequest;
    /** the counter fiat currency, for display */
    counterCurrency: CurrencyDefinition;
    /** the request's expected amount in counter currency */
    counterValue?: string;
    /**
     * set the pending status for UX purposes
     * Pending means the payment is being processed and takes a long time.
     */
    setPending: (val: boolean) => void;
    update: () => Promise<void>;
}
/**
 * This context loads the request, based on ID in the URL.
 * It also handles rate conversion of the request's amount in a counter currency,
 * as well as the pending state, that exists for UX reasons.
 */
export declare const RequestContext: React.Context<IContext | null>;
/** Loads the request and converts the amount to counter currency */
export declare const RequestProvider: React.FC<{
    children: React.ReactNode;
    chainId?: string | number;
}>;
/** Utility to use the Request context */
export declare const useRequest: () => IContext;
export {};
