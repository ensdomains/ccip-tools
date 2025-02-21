import { FC, useState } from "react";
import { TransactionState, TransactionStateDeployed, TransactionStatePending, useDeployedResolvers } from "../../../stores/deployed_resolvers";
import { useChainId, useReadContract, useTransaction } from "wagmi";
import { Button, Card, Input } from "@ensdomains/thorin";
import { FiChevronDown, FiChevronRight, FiChevronUp, FiExternalLink, FiFile, FiPenTool, FiTrash, FiTrash2 } from 'react-icons/fi';
import { formatAddress } from '@ens-tools/format';
import { chainIdToName, explorer_urls } from "../../../util/deployments";
import { cx } from "../../../util/cx";
import { SetUrlDialog } from "../set_url/SetUrlDialog";
import { Address } from "viem";

export const DeployedSOResolver: FC<{ transaction: TransactionStateDeployed }> = ({ transaction }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [urlDialogOpen, setUrlDialogOpen] = useState(false);

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
        <div className="border-t pt-4">
            <div className="w-full flex justify-between items-center px-4 pb-2">
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
                                chainIdToName(Number.parseInt(transaction.chain))
                            }
                        </span>
                    </div>
                </div>
                <a href={explorer_url.transaction.replace(":hash", transaction.hash)} target="_blank" className="flex items-center justify-center gap-1 text-sm text-ens-blue hover:underline">
                    Confirmed <FiExternalLink />
                </a>
            </div>
            <div className={cx("mt-2 space-y-4 px-4", collapsed && 'hidden')}>
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
                <div className="flex gap-2 items-center justify-between">
                    <div>Set as Resolver</div>
                    <button className="text-right flex items-center text-ens-blue hover:font-bold cursor-pointer" onClick={() => {
                        console.log('hi');
                    }}>
                        Set as Resolver <FiChevronRight />
                    </button>
                </div>

                <div className="flex gap-2">
                    {/* <Button onClick={() => { }} size="small">
                        Set as Resolver
                    </Button> */}
                    <div className="aspect-square">
                        <Button onClick={() => { }} size="small" colorStyle="redSecondary" title="Delete Entry">
                            <FiTrash2 />
                        </Button>
                    </div>
                    <div className="aspect-square">
                        <Button onClick={() => setUrlDialogOpen(true)} size="small" colorStyle="blueSecondary" title="Set URL">
                            <FiPenTool />
                        </Button>
                    </div>
                </div>
            </div>

            <button onClick={() => setCollapsed(!collapsed)} className="text-ens-blue hover:font-bold cursor-pointer hover:bg-ens-blue/10 w-full flex justify-center items-center text-xs">
                {collapsed ? 'Show Details' : 'Hide Details'}
                {collapsed ? <FiChevronDown /> : <FiChevronUp />}
            </button>
            {urlDialogOpen && (
                <SetUrlDialog chain={Number.parseInt(transaction.chain)} resolver={transaction.contract_address as Address} current_value={gateway_url} onClose={() => { setUrlDialogOpen(false) }} />
            )}
        </div>
    )
};