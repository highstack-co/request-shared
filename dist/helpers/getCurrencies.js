"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencies = void 0;
const currency_1 = require("@requestnetwork/currency");
const types_1 = require("@requestnetwork/types");
const defaultCurrencies = currency_1.CurrencyManager.getDefaultList();
const getCurrencies = () => [
    ...defaultCurrencies.filter((x) => x.type === types_1.RequestLogicTypes.CURRENCY.ETH ||
        ["DAI-mainnet", "USDC-mainnet", "USDT-mainnet", "FAU-goerli"].includes(x.id)),
    {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        network: "matic",
        decimals: 6,
        symbol: "USDC",
        type: types_1.RequestLogicTypes.CURRENCY.ERC20,
    },
    {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        network: "matic",
        decimals: 6,
        symbol: "USDT",
        type: types_1.RequestLogicTypes.CURRENCY.ERC20,
    },
    {
        address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
        network: "xdai",
        decimals: 6,
        symbol: "USDC",
        type: types_1.RequestLogicTypes.CURRENCY.ERC20,
    },
];
exports.getCurrencies = getCurrencies;
//# sourceMappingURL=getCurrencies.js.map