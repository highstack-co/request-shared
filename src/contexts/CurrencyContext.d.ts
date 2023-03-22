import { PropsWithChildren } from "react";
import { CurrencyDefinition, CurrencyInput, CurrencyManager } from "@requestnetwork/currency";
export declare function CurrencyProvider<TMeta>({ children, currencies, }: PropsWithChildren<{
    currencies: (CurrencyInput & {
        id?: string;
        meta?: TMeta;
    })[];
}>): JSX.Element;
export declare const useCurrency: () => {
    currencyList: CurrencyDefinition[];
    currencyManager: CurrencyManager<unknown>;
};
