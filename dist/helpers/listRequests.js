import { useCallback } from "react";
import { IdentityTypes } from "@requestnetwork/types";
import { EventEmitter } from "events";
import { parseRequest } from "./parseRequest";
import { chainIdToName } from "./chainIdToName";
import { useCurrency } from "../contexts/CurrencyContext";
import { getRequestClient } from "./client";
export class BalanceEventEmitter extends EventEmitter {
    constructor() {
        super(...arguments);
        this._untypedOn = this.on;
        this._untypedEmit = this.emit;
        this.on = (event, listener) => this._untypedOn(event, listener);
        this.emit = (event, ...args) => this._untypedEmit(event, ...args);
    }
}
export const useListRequests = () => {
    const { currencyManager } = useCurrency();
    return useCallback((account, network, isSmartContract = false) => listRequests(account, network, isSmartContract, currencyManager), [currencyManager]);
};
export const listRequests = async (account, network, isSmartContract = false, currencyManager) => {
    network = chainIdToName(network);
    if (!account) {
        throw new Error("Not connected");
    }
    const requestNetwork = getRequestClient(network);
    const requests = await requestNetwork.fromIdentity({
        type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
        value: account,
    }, undefined, {
        disablePaymentDetection: true,
    });
    if (isSmartContract) {
        // TODO @VRO
        console.log("Nothing to do, yet.");
    }
    const list = [];
    for (const request of requests) {
        try {
            const parsedRequest = await parseRequest({
                requestId: request.requestId,
                data: request.getData(),
                network: network,
                pending: false,
                currencyManager,
            });
            parsedRequest.loaded = false;
            list.push(parsedRequest);
        }
        catch (e) {
            console.log(`request ${request.requestId} could not be parsed: ${e}`);
        }
    }
    const sorted = list.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
    const emitter = new BalanceEventEmitter();
    return {
        // preloaded requests, without balance
        requests: sorted,
        // a function to start loading balances.
        // The callback is called for each updated balance.
        loadBalances: () => loadBalances(requests, sorted, network, emitter, currencyManager),
        on: emitter.on,
    };
};
const loadBalances = async (requests, sortedRequests, network, emitter, currencyManager) => {
    let i = 0;
    // update balances by batches of 10.
    while (i < sortedRequests.length) {
        const promises = [];
        for (let j = i; j < Math.min(i + 10, sortedRequests.length); j++) {
            const parsedRequest = sortedRequests[j];
            const request = requests.find(x => x.requestId === parsedRequest.requestId);
            if (!request) {
                continue;
            }
            const promise = loadBalance(request, network, currencyManager);
            promise.then(req => req && emitter.emit("update", req));
            promises.push(promise);
        }
        await Promise.all(promises);
        i += 10;
    }
    emitter.emit("finished");
};
const loadBalance = async (request, network, currencyManager) => {
    try {
        await request.refreshBalance();
    }
    catch (e) {
        return null;
    }
    const newParsedRequest = await parseRequest({
        requestId: request.requestId,
        data: request.getData(),
        network,
        pending: false,
        currencyManager,
    });
    newParsedRequest.loaded = true;
    return newParsedRequest;
};
//# sourceMappingURL=listRequests.js.map