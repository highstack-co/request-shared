"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRequest = void 0;
const chainIdToName_1 = require("./chainIdToName");
const types_1 = require("@requestnetwork/types");
const ethers_1 = require("ethers");
const CustomSignatureProvider_1 = require("./CustomSignatureProvider");
const client_1 = require("./client");
const cancelRequest = async (requestId, account, network) => {
    network = (0, chainIdToName_1.chainIdToName)(network);
    const win = window;
    if (!win.ethereum) {
        throw new Error("ethereum not detected");
    }
    let signatureProvider = new CustomSignatureProvider_1.CustomSignatureProvider(new ethers_1.providers.Web3Provider(window.ethereum).getSigner());
    if (!win.ethereum.isMetamask) {
        const { Web3SignatureProvider } = require("@requestnetwork/web3-signature");
        signatureProvider = new Web3SignatureProvider(win.ethereum);
    }
    const rn = (0, client_1.getRequestClient)(network, signatureProvider);
    const request = await rn.fromRequestId(requestId);
    const cancellation = await request.cancel({
        type: types_1.IdentityTypes.TYPE.ETHEREUM_ADDRESS,
        value: account,
    });
    await new Promise(resolve => cancellation.on("confirmed", resolve));
};
exports.cancelRequest = cancelRequest;
//# sourceMappingURL=cancelRequest.js.map