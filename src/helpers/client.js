import { RequestNetwork } from "@requestnetwork/request-client.js";
import { useCurrency } from "../contexts/CurrencyContext";
export const useRequestClient = (network, signatureProvider) => {
  const { currencyList } = useCurrency();
  return getRequestClient(network, signatureProvider, currencyList);
};
export const getRequestClient = (network, signatureProvider, currencyList) => {
  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: network === "goerli" ? `https://${network}.gateway.request.network/` : `https://xdai.gateway.request.network/`,
    },
    signatureProvider,
    currencies: currencyList,
  });
  return requestNetwork;
};
//# sourceMappingURL=client.js.map
