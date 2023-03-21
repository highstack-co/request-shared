/** attempt to get the connected wallet. Falls back to the connector name (injected, walletconnect...) */
export const getProviderName = (connectorName) => {
    var _a, _b, _c, _d, _e, _f;
    const provider = window.ethereum;
    if (provider) {
        if (provider.isMetaMask)
            return "metamask";
        if (provider.isTrust)
            return "trust";
        if (provider.isGoWallet)
            return "goWallet";
        if (provider.isAlphaWallet)
            return "alphaWallet";
        if (provider.isStatus)
            return "status";
        if (provider.isToshi)
            return "coinbase";
        if (provider.isGSNProvider)
            return "GSN";
        if (((_a = provider.constructor) === null || _a === void 0 ? void 0 : _a.name) === "EthereumProvider")
            return "mist";
        if (((_b = provider.constructor) === null || _b === void 0 ? void 0 : _b.name) === "Web3FrameProvider")
            return "parity";
        if (((_c = provider.host) === null || _c === void 0 ? void 0 : _c.indexOf("infura")) !== -1)
            return "infura";
        if (((_d = provider.connection) === null || _d === void 0 ? void 0 : _d.url.indexOf("infura")) !== -1)
            return "infura";
        if (((_e = provider.host) === null || _e === void 0 ? void 0 : _e.indexOf("localhost")) !== -1)
            return "localhost";
        if (((_f = provider.host) === null || _f === void 0 ? void 0 : _f.indexOf("127.0.0.1")) !== -1)
            return "localhost";
    }
    if (connectorName)
        return connectorName;
    return "unknown";
};
//# sourceMappingURL=getProviderName.js.map