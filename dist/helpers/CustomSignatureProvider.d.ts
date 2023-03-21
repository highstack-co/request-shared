import { providers } from "ethers";
import { IdentityTypes, SignatureProviderTypes, SignatureTypes } from "@requestnetwork/types";
export declare class CustomSignatureProvider implements SignatureProviderTypes.ISignatureProvider {
    private signer;
    constructor(signer: providers.JsonRpcSigner);
    /** list of supported signing method */
    supportedMethods: SignatureTypes.METHOD[];
    /** list of supported identity types */
    supportedIdentityTypes: IdentityTypes.TYPE[];
    sign(data: any, signer: IdentityTypes.IIdentity): Promise<SignatureTypes.ISignedData>;
    /** Get the signed data, if valid, null if not */
    private getSignedData;
}
