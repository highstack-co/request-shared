"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequest = exports.RequestProvider = exports.RequestContext = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const useRate_1 = require("../hooks/useRate");
const parseRequest_1 = require("../helpers/parseRequest");
const chainIdToName_1 = require("../helpers/chainIdToName");
const CurrencyContext_1 = require("./CurrencyContext");
const client_1 = require("../helpers/client");
/**
 * This context loads the request, based on ID in the URL.
 * It also handles rate conversion of the request's amount in a counter currency,
 * as well as the pending state, that exists for UX reasons.
 */
exports.RequestContext = react_1.default.createContext(null);
/** Gets a request from a gateway. Tries mainnet then goerli */
const loadRequest = async (requestId, network) => {
    if (!network) {
        return ((await loadRequest(requestId, "xdai")) ||
            (await loadRequest(requestId, "mainnet")) ||
            (await loadRequest(requestId, "goerli")));
    }
    network = (0, chainIdToName_1.chainIdToName)(network);
    try {
        const rn = (0, client_1.getRequestClient)(network);
        return {
            network,
            request: await rn.fromRequestId(requestId),
        };
    }
    catch (error) {
        return null;
    }
};
/** Loads the request and converts the amount to counter currency */
const RequestProvider = ({ children, chainId }) => {
    const { currencyManager } = (0, CurrencyContext_1.useCurrency)();
    const { id } = (0, react_router_dom_1.useParams)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [parsedRequest, setParsedRequest] = (0, react_1.useState)();
    const counterCurrency = currencyManager.from("USD");
    const [counterValue, setCounterValue] = (0, react_1.useState)("");
    const [pending, setPending] = (0, react_1.useState)(false);
    // gets counter currency rate
    const rate = (0, useRate_1.useRate)(parsedRequest === null || parsedRequest === void 0 ? void 0 : parsedRequest.currency, counterCurrency);
    (0, react_1.useEffect)(() => {
        setLoading(true);
        setParsedRequest(undefined);
    }, [chainId]);
    const fetchRequest = async (id, chainId, pending) => {
        if (!id) {
            return;
        }
        console.log({ id, chainId });
        const result = await loadRequest(id, chainId);
        if (result) {
            const parseResult = await (0, parseRequest_1.parseRequest)({
                requestId: result.request.requestId,
                data: result.request.getData(),
                network: result.network,
                pending,
                currencyManager,
            });
            parseResult.loaded = true;
            setParsedRequest(parseResult);
        }
    };
    // load request and handle pending state change.
    (0, react_1.useEffect)(() => {
        fetchRequest(id, chainId, pending).finally(() => setLoading(false));
    }, [id, pending, chainId]);
    // handle rate conversion
    (0, react_1.useEffect)(() => {
        if (rate && (parsedRequest === null || parsedRequest === void 0 ? void 0 : parsedRequest.amount))
            setCounterValue((rate * parsedRequest.amount).toFixed(2));
        else {
            setCounterValue("");
        }
    }, [rate, parsedRequest]);
    return (react_1.default.createElement(exports.RequestContext.Provider, { value: {
            loading,
            request: parsedRequest,
            counterCurrency,
            counterValue,
            setPending,
            update: (0, react_1.useCallback)(() => fetchRequest(id, chainId, pending), [id, chainId, pending]),
        } }, children));
};
exports.RequestProvider = RequestProvider;
/** Utility to use the Request context */
const useRequest = () => {
    const context = react_1.default.useContext(exports.RequestContext);
    if (!context) {
        throw new Error("This hook must be used inside a RequestProvider");
    }
    return context;
};
exports.useRequest = useRequest;
//# sourceMappingURL=RequestContext.js.map