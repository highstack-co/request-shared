import { Request } from "@requestnetwork/request-client.js";
export interface ICreateRequestArgs {
    payer?: string;
    amount: number;
    currencyId: string;
    paymentAddress?: string;
    contentData: any;
    topics?: string[];
}
export declare const useCreateRequest: () => ({ currencyId, amount, payer, paymentAddress, contentData, topics, }: ICreateRequestArgs, account: string, chainId: string | number) => Promise<Request>;
