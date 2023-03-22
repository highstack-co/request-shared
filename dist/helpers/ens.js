"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnsName = exports.isValidEns = exports.ENS = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const wallet_address_validator_1 = tslib_1.__importDefault(require("wallet-address-validator"));
const react_1 = require("react");
const ensCache = {};
class EnsResolverContract extends ethers_1.Contract {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, EnsResolverContract.abi, signerOrProvider);
    }
}
EnsResolverContract.abi = [
    "function text(bytes32 node, string key) view returns (string)",
    "function addr(bytes32 node) view returns (address)",
    "function name(bytes32 node) view returns (string)",
];
class EnsRegistryContract extends ethers_1.Contract {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, EnsRegistryContract.abi, signerOrProvider);
    }
}
EnsRegistryContract.abi = [
    "function resolver(bytes32 node) view returns (address)",
];
const getResolver = async (nodehash, provider) => {
    if (!provider) {
        const eth = window.ethereum;
        const chainId = Number(eth === null || eth === void 0 ? void 0 : eth.chainId);
        if (eth && (chainId === 1 || chainId === 4)) {
            provider = new ethers_1.ethers.providers.Web3Provider(eth);
        }
        else {
            provider = ethers_1.ethers.getDefaultProvider("mainnet");
        }
    }
    const registryContract = EnsRegistryContract.connect(ENS.registryAddress, provider);
    const resolverContractAddress = await registryContract.resolver(nodehash);
    if (resolverContractAddress &&
        resolverContractAddress != "0x0000000000000000000000000000000000000000") {
        return EnsResolverContract.connect(resolverContractAddress, provider);
    }
    return undefined;
};
class ENS {
    static async resolve(address, provider) {
        if (ensCache[address] === undefined) {
            console.log(`cache missed for ${address} => ${ensCache[address]}`);
            const nodehash = ethers_1.utils.namehash(address.substring(2) + ".addr.reverse");
            ensCache[address] = getResolver(nodehash, provider).then(resolver => resolver ? resolver.name(nodehash) : null);
        }
        return ensCache[address] || undefined;
    }
    static async fromAddress(address, provider) {
        const name = await ENS.resolve(address, provider);
        return name ? new ENS(name, provider) : null;
    }
    constructor(name, provider) {
        this.name = name;
        this.provider = provider;
        if (wallet_address_validator_1.default.validate(name, "ethereum")) {
            throw new Error("ens should not be an ethereum address");
        }
        this.nodehash = ethers_1.utils.namehash(name);
    }
    async getResolver() {
        if (!this.resolver) {
            this.resolver = await getResolver(this.nodehash, this.provider);
        }
        return this.resolver;
    }
    async addr() {
        const resolver = await this.getResolver();
        if (!resolver) {
            return undefined;
        }
        return await resolver.addr(this.nodehash);
    }
    async text(key) {
        const resolver = await this.getResolver();
        if (!resolver) {
            return undefined;
        }
        return await resolver.text(this.nodehash, key);
    }
}
ENS.registryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
exports.ENS = ENS;
const isValidEns = (val) => /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?$/.test(val);
exports.isValidEns = isValidEns;
const useEnsName = (address, { disabled, timeout } = {}) => {
    const [name, setName] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(!disabled);
    (0, react_1.useEffect)(() => {
        if (disabled)
            return;
        if (!address) {
            if (timeout) {
                const t = setTimeout(() => {
                    setLoading(false);
                }, timeout);
                return () => clearTimeout(t);
            }
        }
        else {
            ENS.resolve(address)
                .then(setName)
                .finally(() => setLoading(false));
        }
        return () => { };
    }, [disabled, address]);
    return [name || undefined, { loading }];
};
exports.useEnsName = useEnsName;
//# sourceMappingURL=ens.js.map