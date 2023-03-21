import React from "react";
import { CurrencyManager, } from "@requestnetwork/currency";
const CurrencyContext = React.createContext(null);
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
export function CurrencyProvider({ children, currencies, }) {
    const currencyList = currencies.map(CurrencyManager.fromInput);
    return (React.createElement(CurrencyContext.Provider, { value: { currencyList } }, children));
}
export const useCurrency = () => {
    const context = React.useContext(CurrencyContext);
    if (!context) {
        throw new Error("This hook must be used inside a CurrencyProvider");
    }
    const { currencyList } = context;
    const currencyManager = new CurrencyManager(currencyList);
    return React.useMemo(() => ({ currencyList, currencyManager }), []);
};
//# sourceMappingURL=CurrencyContext.js.map