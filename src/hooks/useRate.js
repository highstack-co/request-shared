import { useState, useEffect } from "react";
/** Load rate conversion between two currencies */
export const useRate = (currency, counterCurrency) => {
    const [rate, setRate] = useState();
    useEffect(() => {
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
//# sourceMappingURL=useRate.js.map