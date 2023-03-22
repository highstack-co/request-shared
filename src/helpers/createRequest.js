import { IdentityTypes, PaymentTypes, RequestLogicTypes, } from "@requestnetwork/types";
import { constants, providers } from "ethers";
import WalletAddressValidator from "wallet-address-validator";
import { chainIdToName } from "./chainIdToName";
import { ENS, isValidEns } from "./ens";
import { CustomSignatureProvider } from "./CustomSignatureProvider";
import { getDefaultProvider } from "ethers";
import { CurrencyManager } from "@requestnetwork/currency";
import { useCurrency } from "../contexts/CurrencyContext";
import { utils } from "ethers";
import { getRequestClient } from "./client";
export const useCreateRequest = () => {
    const { currencyManager, currencyList } = useCurrency();
    const createRequest = async ({ currencyId, amount, payer, paymentAddress, contentData, topics, }, account, chainId) => {
        const win = window;
        if (!win.ethereum) {
            throw new Error("ethereum not detected");
        }
        const chainName = chainIdToName(chainId);
        let signatureProvider = new CustomSignatureProvider(new providers.Web3Provider(window.ethereum).getSigner());
        if (!win.ethereum.isMetamask) {
            const { Web3SignatureProvider, } = require("@requestnetwork/web3-signature");
            signatureProvider = new Web3SignatureProvider(win.ethereum);
        }
        const requestNetwork = getRequestClient(chainName, signatureProvider, currencyList);
        const currency = currencyManager.fromId(currencyId);
        const isEth = currency.type === RequestLogicTypes.CURRENCY.ETH;
        const paymentNetwork = isEth
            ? {
                id: PaymentTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
                parameters: { paymentAddress },
            }
            : {
                id: PaymentTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
                parameters: {
                    paymentAddress,
                    feeAmount: "0",
                    feeAddress: constants.AddressZero,
                },
            };
        if (payer) {
            if (isValidEns(payer)) {
                const provider = getDefaultProvider(chainName === "goerli" ? "goerli" : "mainnet");
                payer = await new ENS(payer, provider).addr();
            }
            else if (!WalletAddressValidator.validate(payer, "ethereum")) {
                throw new Error("invalid ethereum address");
            }
        }
        const request = await requestNetwork.createRequest({
            requestInfo: {
                currency: CurrencyManager.toStorageCurrency(currency),
                expectedAmount: utils
                    .parseUnits(amount.toString(), currency.decimals)
                    .toString(),
                payer: payer
                    ? {
                        type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
                        value: payer,
                    }
                    : undefined,
                payee: {
                    type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
                    value: account,
                },
            },
            paymentNetwork,
            contentData,
            signer: {
                type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
                value: account,
            },
            topics,
        });
        return request;
    };
    return createRequest;
};
//# sourceMappingURL=createRequest.js.map