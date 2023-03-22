"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRequests = exports.useListRequests = exports.BalanceEventEmitter = void 0;
const react_1 = require("react");
const types_1 = require("@requestnetwork/types");
const events_1 = require("events");
const parseRequest_1 = require("./parseRequest");
const chainIdToName_1 = require("./chainIdToName");
const CurrencyContext_1 = require("../contexts/CurrencyContext");
const client_1 = require("./client");
class BalanceEventEmitter extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this._untypedOn = this.on;
        this._untypedEmit = this.emit;
        this.on = (event, listener) => this._untypedOn(event, listener);
        this.emit = (event, ...args) => this._untypedEmit(event, ...args);
    }
}
exports.BalanceEventEmitter = BalanceEventEmitter;
const useListRequests = () => {
    const { currencyManager } = (0, CurrencyContext_1.useCurrency)();
    return (0, react_1.useCallback)((account, network, isSmartContract = false) => (0, exports.listRequests)(account, network, isSmartContract, currencyManager), [currencyManager]);
};
exports.useListRequests = useListRequests;
const listRequests = async (account, network, isSmartContract = false, currencyManager) => {
    network = (0, chainIdToName_1.chainIdToName)(network);
    if (!account) {
        throw new Error("Not connected");
    }
    const requestNetwork = (0, client_1.getRequestClient)(network);
    const requests = await requestNetwork.fromIdentity({
        type: types_1.IdentityTypes.TYPE.ETHEREUM_ADDRESS,
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
            const parsedRequest = await (0, parseRequest_1.parseRequest)({
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
exports.listRequests = listRequests;
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
    const newParsedRequest = await (0, parseRequest_1.parseRequest)({
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