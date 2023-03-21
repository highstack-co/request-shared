const etherscanDomain = {
    goerli: "https://goerli.etherscan.io",
    mainnet: "https://etherscan.io",
};
export const getEtherscanUrl = (request) => {
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
//# sourceMappingURL=etherscan.js.map