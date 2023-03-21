import { CurrencyDefinition } from "@requestnetwork/currency";
/** Load rate conversion between two currencies */
export declare const useRate: (currency: CurrencyDefinition | undefined, counterCurrency: CurrencyDefinition | undefined) => number | undefined;
