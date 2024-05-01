import { FC } from "react";
import { TransactionState, TransactionStateDeployed, TransactionStatePending, useDeployedResolvers } from "../../../stores/deployed_resolvers";
import { useChainId, useReadContract, useTransaction } from "wagmi";
import { Button, Card, Input } from "@ensdomains/thorin";
import { FiExternalLink, FiFile, FiTrash, FiTrash2 } from 'react-icons/fi';
import { formatAddress } from '@ens-tools/format';

export const DeployedResolvers = () => {
    const transactions = useDeployedResolvers(e => e.transactions);
    const chain = useChainId();

    const filter_per_chain = false;

    const transactionForChain = filter_per_chain ? transactions.filter(transaction => transaction.chain == chain.toString()) : transactions;

    return (
        <div className="flex flex-col gap-2">
            <Card className="!gap-0 !p-0">
                <div className="p-4">
                    <h2 className="font-bold">Deployed Resolvers</h2>
                    <span>These are the resolvers you have deployed</span>
                </div>
                <div className="w-full">
                    {
                        transactionForChain.map((transaction) => transaction.status == "deployed" ?
                            <DeployedResolver key={transaction.hash} transaction={transaction} /> : <PendingTransaction key={transaction.hash} transaction={transaction} />).reverse()
                    }
                </div>
            </Card>
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
    11155111: {
        transaction: 'https://sepolia.etherscan.io/tx/:hash',
        address: 'https://sepolia.etherscan.io/address/:address'
    },
};

export const DeployedResolver: FC<{ transaction: TransactionStateDeployed }> = ({ transaction }) => {
    const { data: gateway_data, error } = useReadContract({
        address: transaction.contract_address as any,
        abi: [{ name: 'url', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: 'url', type: 'string' }] }] as const,
        functionName: 'url',
        chainId: Number.parseInt(transaction.chain),
        args: [],
    });
    const { data: transactionData } = useTransaction({
        hash: transaction.hash as `0x${string}`,
        chainId: Number.parseInt(transaction.chain),
    });

    const explorer_url = explorer_urls[Number.parseInt(transaction.chain)];
    const gateway_url = gateway_data as string;

    return (
        <div className="p-4 border-t">
            <div className="w-full flex justify-between items-center">
                <div>
                    <div className="flex gap-1 items-center">
                        {/* <FiFile /> */}
                        <a href={explorer_url.address.replace(":address", transaction.contract_address)} target="_blank" className="flex items-center justify-center gap-1 text-sm">
                            <span>
                                {formatAddress(transaction.contract_address)}
                            </span>
                            <FiExternalLink />
                        </a>
                    </div>
                    <div className="text-sm flex gap-1">
                        <span className="text-sm">
                            Offchain Resolver
                        </span>
                        <span>on</span>
                        <span className="text-ens-purple">
                            {
                                transaction.chain == "1" ? "Mainnet" :
                                    transaction.chain == "5" ? "Goerli" :
                                        transaction.chain == "11155111" ? "Sepolia" : "Unknown"
                            }
                        </span>
                    </div>
                </div>
                <a href={explorer_url.transaction.replace(":hash", transaction.hash)} target="_blank" className="flex items-center justify-center gap-1 text-sm text-ens-blue hover:underline">
                    Confirmed <FiExternalLink />
                </a>
            </div>
            <div className="mt-2 space-y-4">
                <div className="text-sm">
                    <div className="font-bold">Gateway URL</div>
                    <div className="text-right">{gateway_data || 'Unparsable'}</div>
                </div>
                {/* <div className="flex justify-between">
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
                </div> */}
                <div className="flex gap-2">
                    <Button onClick={() => { }} size="small">
                        Set as Resolver
                    </Button>
                    <div className="aspect-square">
                        <Button onClick={() => { }} size="small" colorStyle="redSecondary">
                            <FiTrash2 />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
};