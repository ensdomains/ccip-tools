import { FC } from "react";
import { TransactionState, TransactionStateDeployed, TransactionStatePending, useDeployedResolvers } from "../../../stores/deployed_resolvers";
import { useChainId, useReadContract, useTransaction } from "wagmi";
import { Button, Card, Input } from "@ensdomains/thorin";
import { FiExternalLink, FiFile, FiTrash, FiTrash2 } from 'react-icons/fi';
import { formatAddress } from '@ens-tools/format';
import { explorer_urls } from "../../../util/deployments";

export const DeployedSOResolver: FC<{ transaction: TransactionStateDeployed }> = ({ transaction }) => {
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
            <div className="mt-2 space-y-4 hidden">
                <div className="text-sm">
                    <div className="font-bold">Gateway URL</div>
                    <div className="text-right">{gateway_data}</div>
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