"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainIdToName = void 0;
const chains = {
    [1]: "mainnet",
    [5]: "goerli",
    [100]: "xdai",
};
const chainIdToName = (chainId) => {
    const name = typeof chainId === "number" ? chains[chainId] : chainId;
    if (!name || !Object.values(chains).includes(name))
        throw new Error(`Network ${chainId} not supported`);
    return name;
};
exports.chainIdToName = chainIdToName;
//# sourceMappingURL=chainIdToName.js.map