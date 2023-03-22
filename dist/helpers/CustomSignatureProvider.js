"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSignatureProvider = void 0;
const tslib_1 = require("tslib");
const utils_1 = tslib_1.__importDefault(require("@requestnetwork/utils"));
const types_1 = require("@requestnetwork/types");
class CustomSignatureProvider {
    constructor(signer) {
        this.signer = signer;
        /** list of supported signing method */
        this.supportedMethods = [
            types_1.SignatureTypes.METHOD.ECDSA,
            types_1.SignatureTypes.METHOD.ECDSA_ETHEREUM,
        ];
        /** list of supported identity types */
        this.supportedIdentityTypes = [
            types_1.IdentityTypes.TYPE.ETHEREUM_ADDRESS,
        ];
    }
    async sign(data, signer) {
        const normalizedData = utils_1.default.crypto.normalize(data);
        const signatureValue = await this.signer.signMessage(Buffer.from(normalizedData));
        // some wallets (like Metamask) do a personal_sign (ECDSA_ETHEREUM),
        //  some (like Trust) do a simple sign (ECDSA)
        const signedData = this.getSignedData(data, signatureValue, types_1.SignatureTypes.METHOD.ECDSA_ETHEREUM, signer) ||
            this.getSignedData(data, signatureValue, types_1.SignatureTypes.METHOD.ECDSA, signer);
        if (!signedData)
            throw new Error("Signature failed!");
        return signedData;
    }
    /** Get the signed data, if valid, null if not */
    getSignedData(data, value, method, signer) {
        const signedData = {
            data,
            signature: {
                method,
                value,
            },
        };
        if (utils_1.default.identity.areEqual(utils_1.default.signature.recover(signedData), signer)) {
            return signedData;
        }
        return null;
    }
}
exports.CustomSignatureProvider = CustomSignatureProvider;
//# sourceMappingURL=CustomSignatureProvider.js.map