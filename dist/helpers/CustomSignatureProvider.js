import Utils from "@requestnetwork/utils";
import { IdentityTypes, SignatureTypes, } from "@requestnetwork/types";
export class CustomSignatureProvider {
    constructor(signer) {
        this.signer = signer;
        /** list of supported signing method */
        this.supportedMethods = [
            SignatureTypes.METHOD.ECDSA,
            SignatureTypes.METHOD.ECDSA_ETHEREUM,
        ];
        /** list of supported identity types */
        this.supportedIdentityTypes = [
            IdentityTypes.TYPE.ETHEREUM_ADDRESS,
        ];
    }
    async sign(data, signer) {
        const normalizedData = Utils.crypto.normalize(data);
        const signatureValue = await this.signer.signMessage(Buffer.from(normalizedData));
        // some wallets (like Metamask) do a personal_sign (ECDSA_ETHEREUM),
        //  some (like Trust) do a simple sign (ECDSA)
        const signedData = this.getSignedData(data, signatureValue, SignatureTypes.METHOD.ECDSA_ETHEREUM, signer) ||
            this.getSignedData(data, signatureValue, SignatureTypes.METHOD.ECDSA, signer);
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
        if (Utils.identity.areEqual(Utils.signature.recover(signedData), signer)) {
            return signedData;
        }
        return null;
    }
}
//# sourceMappingURL=CustomSignatureProvider.js.map