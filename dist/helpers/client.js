"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestClient = exports.useRequestClient = void 0;
const request_client_js_1 = require("@requestnetwork/request-client.js");
const CurrencyContext_1 = require("../contexts/CurrencyContext");
const useRequestClient = (network, signatureProvider) => {
    const { currencyList } = (0, CurrencyContext_1.useCurrency)();
    return (0, exports.getRequestClient)(network, signatureProvider, currencyList);
};
exports.useRequestClient = useRequestClient;
const getRequestClient = (network, signatureProvider, currencyList) => {
    const requestNetwork = new request_client_js_1.RequestNetwork({
        nodeConnectionConfig: {
            baseURL: network === "goerli" ? `https://${network}.gateway.request.network/` : `https://xdai.gateway.request.network/`,
        },
        signatureProvider,
        currencies: currencyList,
    });
    return requestNetwork;
};
exports.getRequestClient = getRequestClient;
//# sourceMappingURL=client.js.map