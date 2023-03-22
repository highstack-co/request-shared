"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEthereumChain = exports.chainInfos = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
tslib_1.__exportStar(require("./contexts/RequestContext"), exports);
tslib_1.__exportStar(require("./contexts/CurrencyContext"), exports);
tslib_1.__exportStar(require("./hooks/useRate"), exports);
tslib_1.__exportStar(require("./helpers"), exports);
exports.chainInfos = {
    mainnet: { id: "mainnet", name: "Ethereum", chainId: 1, color: "#038789" },
    xdai: {
        id: "xdai",
        color: "#48a900",
        chainId: 100,
        name: "xDAI Chain",
        rpcUrls: ["https://gnosischain-rpc.gateway.pokt.network/"],
        nativeCurrency: {
            name: "xDAI",
            symbol: "xDAI",
            decimals: 18,
        },
        blockExplorerUrls: ["https://gnosischain.io/"],
    },
    matic: {
        id: "matic",
        name: "Polygon",
        chainId: 137,
        blockExplorerUrls: ["https://polygonscan.com/"],
        nativeCurrency: {
            name: "Matic",
            symbol: "MATIC",
            decimals: 18,
        },
        rpcUrls: ["https://rpc-mainnet.matic.network/"],
    },
    goerli: {
        id: "goerli",
        name: "Goerli",
        chainId: 5,
        color: "#FFB95F",
        blockExplorerUrls: ["https://goerli.etherscan.io/"],
        nativeCurrency: {
            name: "ETH-goerli",
            symbol: "ETH",
            decimals: 18,
        },
    },
};
const addEthereumChain = (chain, library) => {
    const { chainId, name, blockExplorerUrls, rpcUrls, nativeCurrency } = exports.chainInfos[chain] || {};
    if (!library) {
        library = new ethers_1.providers.Web3Provider(window.ethereum);
    }
    // first attempt to switch to that chain
    try {
        return library.send("wallet_switchEthereumChain", [
            { chainId: ethers_1.utils.hexValue(chainId) },
        ]);
    }
    catch (_a) { }
    if (!rpcUrls || rpcUrls.length === 0) {
        return null;
    }
    return library.send("wallet_addEthereumChain", [
        {
            chainId: ethers_1.utils.hexValue(chainId),
            chainName: name,
            blockExplorerUrls,
            rpcUrls: rpcUrls ? rpcUrls : [],
            nativeCurrency,
        },
    ]);
};
exports.addEthereumChain = addEthereumChain;
Object.values(exports.chainInfos).forEach((val) => (exports.chainInfos[val.chainId] = val));
//# sourceMappingURL=index.js.map