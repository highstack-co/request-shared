"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrency = exports.CurrencyProvider = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const currency_1 = require("@requestnetwork/currency");
const CurrencyContext = react_1.default.createContext(null);
// const getCurrencies = (network: number) => {
//   if (network === 4) {
//     return {
//       FAU: currencies.DaiIcon,
//       ETH: currencies.EthIcon,
//     };
//   } else {
//     return {
//       DAI: currencies.DaiIcon,
//       ETH: currencies.EthIcon,
//       // USDT: UsdtIcon,
//       USDC: currencies.UsdcIcon,
//       PAX: currencies.PaxIcon,
//       // BUSD: BusdIcon,
//       TUSD: currencies.TusdIcon,
//     };
//   }
// };
function CurrencyProvider({ children, currencies, }) {
    const currencyList = currencies.map(currency_1.CurrencyManager.fromInput);
    return (react_1.default.createElement(CurrencyContext.Provider, { value: { currencyList } }, children));
}
exports.CurrencyProvider = CurrencyProvider;
const useCurrency = () => {
    const context = react_1.default.useContext(CurrencyContext);
    if (!context) {
        throw new Error("This hook must be used inside a CurrencyProvider");
    }
    const { currencyList } = context;
    const currencyManager = new currency_1.CurrencyManager(currencyList);
    return react_1.default.useMemo(() => ({ currencyList, currencyManager }), []);
};
exports.useCurrency = useCurrency;
//# sourceMappingURL=CurrencyContext.js.map