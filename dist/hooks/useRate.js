"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRate = void 0;
const react_1 = require("react");
/** Load rate conversion between two currencies */
const useRate = (currency, counterCurrency) => {
    const [rate, setRate] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        if (currency && counterCurrency) {
            let curr = currency.symbol;
            fetch(`https://min-api.cryptocompare.com/data/price?fsym=${curr}&tsyms=${counterCurrency}`)
                .then(res => res.json())
                .then(res => {
                setRate(res[counterCurrency.symbol]);
            });
        }
    }, [currency, counterCurrency]);
    return rate;
};
exports.useRate = useRate;
//# sourceMappingURL=useRate.js.map