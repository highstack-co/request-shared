import { providers, utils } from "ethers";
export * from "./contexts/RequestContext";
export * from "./contexts/CurrencyContext";
export * from "./hooks/useRate";
export * from "./helpers";
export const chainInfos = {
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
export const addEthereumChain = (chain, library) => {
    const { chainId, name, blockExplorerUrls, rpcUrls, nativeCurrency } = chainInfos[chain] || {};
    if (!library) {
        library = new providers.Web3Provider(window.ethereum);
    }
    // first attempt to switch to that chain
    try {
        return library.send("wallet_switchEthereumChain", [
            { chainId: utils.hexValue(chainId) },
        ]);
    }
    catch (_a) { }
    if (!rpcUrls || rpcUrls.length === 0) {
        return null;
    }
    return library.send("wallet_addEthereumChain", [
        {
            chainId: utils.hexValue(chainId),
            chainName: name,
            blockExplorerUrls,
            rpcUrls: rpcUrls ? rpcUrls : [],
            nativeCurrency,
        },
    ]);
};
Object.values(chainInfos).forEach((val) => (chainInfos[val.chainId] = val));
//# sourceMappingURL=index.js.map