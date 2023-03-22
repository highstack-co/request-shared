"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCancelError = void 0;
const isCancelError = (e) => {
    return (e.code === 4001 ||
        e.message === "canceled" ||
        e.message === "Sign message cancelled");
};
exports.isCancelError = isCancelError;
//# sourceMappingURL=isCancelError.js.map