import { FC } from "react";
import { TransactionState, TransactionStateDeployed, TransactionStatePending, useDeployedResolvers } from "../../../stores/deployed_resolvers";
import { useChainId, useContractRead, useTransaction } from "wagmi";
import { Card, Input } from "@ensdomains/thorin";
import { formatEther } from "viem";
import { FiExternalLink, FiFile } from 'react-icons/fi';

export const DeployedResolvers = () => {
    const transactions = useDeployedResolvers(e => e.transactions);
    const chain = useChainId();

    const transactionForChain = transactions.filter(transaction => transaction.chain == chain.toString());

    return (
        <div className="flex flex-col gap-2">
            <Card className="!gap-0 !p-4">
                <h2 className="font-bold">Deployed Resolvers</h2>
                <span>These are the resolvers you have deployed</span>
            </Card>
            <div className="flex flex-col gap-2">
                {
                    transactionForChain.map((transaction) => transaction.status == "deployed" ?
                        <DeployedResolver key={transaction.hash} transaction={transaction} /> : <PendingTransaction key={transaction.hash} transaction={transaction} />).reverse()
                }
            </div>
        </div>
    )
};

export const PendingTransaction: FC<{ transaction: TransactionState }> = ({ transaction: { hash, chain } }) => {

    return (
        <div className="bg-ens-light-background-primary bg-ens-light-border rounded-lg">
            <div>Pending</div>
            <div>{hash}</div>
            <div>{chain}</div>
        </div>
    );
};

const explorer_urls: Record<number, {
    transaction: string,
    address: string,
}> = {
    1: {
        transaction: 'https://etherscan.io/tx/:hash',
        address: 'https://etherscan.io/address/:address'
    },
    5: {
        transaction: 'https://goerli.etherscan.io/tx/:hash',
        address: 'https://goerli.etherscan.io/address/:address'
    },
};

export const DeployedResolver: FC<{ transaction: TransactionStateDeployed }> = ({ transaction }) => {
    const { data: gateway_data } = useContractRead({
        address: transaction.contract_address as any,
        abi: [{ name: 'url', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: 'url', type: 'string' }] }],
        functionName: 'url',
        enabled: true,
    });
    const { data: transactionData } = useTransaction({
        hash: transaction.hash as `0x${string}`,
        chainId: Number.parseInt(transaction.chain),
    });

    const explorer_url = explorer_urls[Number.parseInt(transaction.chain)];
    const gateway_url = gateway_data as string;

    return (
        <Card className="!p-4">
            <div className="flex gap-1 items-center">
                <FiFile />
                <a href={explorer_url.address.replace(":address", transaction.contract_address)} target="_blank" className="flex items-center justify-center gap-1 text-sm">
                    <span>
                        {transaction.contract_address}
                    </span>
                    <FiExternalLink />
                </a>
            </div>
            <div className="">
                <div>
                    Deployed at
                    <div className="flex gap-2 items-center justify-center">
                        <div className="truncate text-sm font-bold">
                            {transaction.hash}
                        </div>
                        <a href={explorer_url.transaction.replace(":hash", transaction.hash)} target="_blank" className="flex items-center justify-center gap-1 text-sm">
                            TxHsh <FiExternalLink />
                        </a>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div>
                        Total Gas Fees
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <span>
                            🔥
                        </span>
                        <span className="items-center text-ens-light-red-bright">
                            {
                                formatEther(
                                    transactionData?.gasPrice?.mul(transactionData?.gasLimit).toBigInt() ?? BigInt(0))
                            }
                        </span>
                    </div>
                </div>
                <div className="pt-2">
                    <Input label="Gateway Url" defaultValue={gateway_url} />
                </div>
            </div>
        </Card>

    )
};