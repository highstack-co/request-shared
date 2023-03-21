export const isCancelError = (e) => {
    return (e.code === 4001 ||
        e.message === "canceled" ||
        e.message === "Sign message cancelled");
};
//# sourceMappingURL=isCancelError.js.map