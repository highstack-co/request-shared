import { Types } from "@requestnetwork/request-client.js";
import { ICurrencyManager } from "@requestnetwork/currency";
import { IParsedRequest } from "../";
/** Transforms a request to a more friendly format */
export declare const parseRequest: ({ requestId, data, network, pending, currencyManager, }: {
    requestId: string;
    data: Types.IRequestData;
    network: string;
    pending: boolean;
    currencyManager: ICurrencyManager;
}) => Promise<IParsedRequest>;
