"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateRequest = void 0;
const tslib_1 = require("tslib");
const types_1 = require("@requestnetwork/types");
const ethers_1 = require("ethers");
const wallet_address_validator_1 = tslib_1.__importDefault(require("wallet-address-validator"));
const chainIdToName_1 = require("./chainIdToName");
const ens_1 = require("./ens");
const CustomSignatureProvider_1 = require("./CustomSignatureProvider");
const ethers_2 = require("ethers");
const currency_1 = require("@requestnetwork/currency");
const CurrencyContext_1 = require("../contexts/CurrencyContext");
const ethers_3 = require("ethers");
const client_1 = require("./client");
const useCreateRequest = () => {
    const { currencyManager, currencyList } = (0, CurrencyContext_1.useCurrency)();
    const createRequest = async ({ currencyId, amount, payer, paymentAddress, contentData, topics, }, account, chainId) => {
        const win = window;
        if (!win.ethereum) {
            throw new Error("ethereum not detected");
        }
        const chainName = (0, chainIdToName_1.chainIdToName)(chainId);
        let signatureProvider = new CustomSignatureProvider_1.CustomSignatureProvider(new ethers_1.providers.Web3Provider(window.ethereum).getSigner());
        if (!win.ethereum.isMetamask) {
            const { Web3SignatureProvider, } = require("@requestnetwork/web3-signature");
            signatureProvider = new Web3SignatureProvider(win.ethereum);
        }
        const requestNetwork = (0, client_1.getRequestClient)(chainName, signatureProvider, currencyList);
        const currency = currencyManager.fromId(currencyId);
        const isEth = currency.type === types_1.RequestLogicTypes.CURRENCY.ETH;
        const paymentNetwork = isEth
            ? {
                id: types_1.PaymentTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
                parameters: { paymentAddress },
            }
            : {
                id: types_1.PaymentTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
                parameters: {
                    paymentAddress,
                    feeAmount: "0",
                    feeAddress: ethers_1.constants.AddressZero,
                },
            };
        if (payer) {
            if ((0, ens_1.isValidEns)(payer)) {
                const provider = (0, ethers_2.getDefaultProvider)(chainName === "goerli" ? "goerli" : "mainnet");
                payer = await new ens_1.ENS(payer, provider).addr();
            }
            else if (!wallet_address_validator_1.default.validate(payer, "ethereum")) {
                throw new Error("invalid ethereum address");
            }
        }
        const request = await requestNetwork.createRequest({
            requestInfo: {
                currency: currency_1.CurrencyManager.toStorageCurrency(currency),
                expectedAmount: ethers_3.utils
                    .parseUnits(amount.toString(), currency.decimals)
                    .toString(),
                payer: payer
                    ? {
                        type: types_1.IdentityTypes.TYPE.ETHEREUM_ADDRESS,
                        value: payer,
                    }
                    : undefined,
                payee: {
                    type: types_1.IdentityTypes.TYPE.ETHEREUM_ADDRESS,
                    value: account,
                },
            },
            paymentNetwork,
            contentData,
            signer: {
                type: types_1.IdentityTypes.TYPE.ETHEREUM_ADDRESS,
                value: account,
            },
            topics,
        });
        return request;
    };
    return createRequest;
};
exports.useCreateRequest = useCreateRequest;
//# sourceMappingURL=createRequest.js.map