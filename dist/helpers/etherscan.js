"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEtherscanUrl = void 0;
const etherscanDomain = {
    goerli: "https://goerli.etherscan.io",
    mainnet: "https://etherscan.io",
};
const getEtherscanUrl = (request) => {
    var _a;
    if (!request) {
        return "";
    }
    if ("currencyInfo" in request) {
        return ((_a = request === null || request === void 0 ? void 0 : request.currencyInfo) === null || _a === void 0 ? void 0 : _a.network)
            ? etherscanDomain[request.currencyInfo.network]
            : "";
    }
    return request.currencyNetwork
        ? etherscanDomain[request.currencyNetwork]
        : "";
};
exports.getEtherscanUrl = getEtherscanUrl;
//# sourceMappingURL=etherscan.js.map