import { ethers, Contract, utils } from "ethers";
import WalletAddressValidator from "wallet-address-validator";
import { useState, useEffect } from "react";
const ensCache = {};
class EnsResolverContract extends Contract {
    static connect(address, signerOrProvider) {
        return new Contract(address, EnsResolverContract.abi, signerOrProvider);
    }
}
EnsResolverContract.abi = [
    "function text(bytes32 node, string key) view returns (string)",
    "function addr(bytes32 node) view returns (address)",
    "function name(bytes32 node) view returns (string)",
];
class EnsRegistryContract extends Contract {
    static connect(address, signerOrProvider) {
        return new Contract(address, EnsRegistryContract.abi, signerOrProvider);
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
            provider = new ethers.providers.Web3Provider(eth);
        }
        else {
            provider = ethers.getDefaultProvider("mainnet");
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
            const nodehash = utils.namehash(address.substring(2) + ".addr.reverse");
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
        if (WalletAddressValidator.validate(name, "ethereum")) {
            throw new Error("ens should not be an ethereum address");
        }
        this.nodehash = utils.namehash(name);
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
export { ENS };
export const isValidEns = (val) => /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?$/.test(val);
export const useEnsName = (address, { disabled, timeout } = {}) => {
    const [name, setName] = useState();
    const [loading, setLoading] = useState(!disabled);
    useEffect(() => {
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
//# sourceMappingURL=ens.js.map