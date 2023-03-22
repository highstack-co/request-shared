import { utils, BigNumber } from "ethers";
import { Types } from "@requestnetwork/request-client.js";
const getStatus = (state, expectedAmount, balance, pending) => {
    if (!balance)
        return "waiting";
    if (state === Types.RequestLogic.STATE.CANCELED)
        return "canceled";
    if (balance === null || balance === void 0 ? void 0 : balance.eq(expectedAmount))
        return "paid";
    if (balance === null || balance === void 0 ? void 0 : balance.gt(expectedAmount))
        return "overpaid";
    if (pending)
        return "pending";
    return "open";
};
/** Transforms a request to a more friendly format */
export const parseRequest = async ({ requestId, data, network, pending, currencyManager, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    const currency = currencyManager.fromStorageCurrency(data.currencyInfo);
    if (!currency) {
        throw new Error("Currency not found");
    }
    if (currency.type === Types.RequestLogic.CURRENCY.ISO4217) {
        throw new Error("Unsupported currency");
    }
    const { decimals } = currency;
    const amount = Number(utils.formatUnits(data.expectedAmount, decimals));
    let balance = 0;
    if (((_a = data.balance) === null || _a === void 0 ? void 0 : _a.balance) !== null && ((_b = data.balance) === null || _b === void 0 ? void 0 : _b.balance) !== undefined) {
        balance = Number(utils.formatUnits(data.balance.balance, decimals));
    }
    const status = getStatus(data.state, BigNumber.from(data.expectedAmount), ((_c = data.balance) === null || _c === void 0 ? void 0 : _c.balance) ? BigNumber.from(data.balance.balance) : undefined, pending);
    const paidTimestamp = (_e = (_d = data.balance) === null || _d === void 0 ? void 0 : _d.events.reverse()[0]) === null || _e === void 0 ? void 0 : _e.timestamp;
    const canceledTimestamp = (_f = data.events.find(x => x.name === Types.RequestLogic.ACTION_NAME.CANCEL)) === null || _f === void 0 ? void 0 : _f.timestamp;
    const extensionsValues = (_g = Object.values(data.extensions).find(x => x.type === "payment-network")) === null || _g === void 0 ? void 0 : _g.values;
    const paymentParams = (_k = (_j = (_h = data.balance) === null || _h === void 0 ? void 0 : _h.events) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.parameters;
    return {
        requestId,
        amount,
        balance,
        currency,
        status,
        createdDate: new Date(data.timestamp * 1000),
        paidDate: paidTimestamp ? new Date(paidTimestamp * 1000) : undefined,
        canceledDate: canceledTimestamp
            ? new Date(canceledTimestamp * 1000)
            : undefined,
        paymentAddress: extensionsValues === null || extensionsValues === void 0 ? void 0 : extensionsValues.paymentAddress,
        paymentTxHash: paymentParams === null || paymentParams === void 0 ? void 0 : paymentParams.txHash,
        paymentFrom: paymentParams === null || paymentParams === void 0 ? void 0 : paymentParams.from,
        reason: (_l = data.contentData) === null || _l === void 0 ? void 0 : _l.reason,
        invoiceNumber: (_m = data.contentData) === null || _m === void 0 ? void 0 : _m.invoiceNumber,
        currencyType: data.currencyInfo.type,
        currencySymbol: currency.symbol,
        currencyNetwork: "network" in currency ? currency.network : "",
        txHash: (_q = (_p = (_o = data.balance) === null || _o === void 0 ? void 0 : _o.events[0]) === null || _p === void 0 ? void 0 : _p.parameters) === null || _q === void 0 ? void 0 : _q.txHash,
        payee: ((_s = (_r = data.payee) === null || _r === void 0 ? void 0 : _r.value) === null || _s === void 0 ? void 0 : _s.toLowerCase()) || "",
        payer: ((_u = (_t = data.payer) === null || _t === void 0 ? void 0 : _t.value) === null || _u === void 0 ? void 0 : _u.toLowerCase()) || undefined,
        raw: data,
        network,
    };
};
//# sourceMappingURL=parseRequest.js.map