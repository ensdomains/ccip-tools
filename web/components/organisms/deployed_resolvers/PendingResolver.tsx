import { FC, useEffect } from "react";
import { FiExternalLink, FiLoader } from "react-icons/fi";
import { TransactionStatePending, useDeployedResolvers } from "../../../stores/deployed_resolvers";
import { explorer_urls } from "../../../util/deployments";
import { useWaitForTransactionReceipt } from "wagmi";

export const PendingResolver: FC<{ transaction: TransactionStatePending }> = ({ transaction }) => {
    const { data: receipt } = useWaitForTransactionReceipt({
        chainId: Number.parseInt(transaction.chain),
        hash: transaction.hash as `0x${string}`,
    });
    const {logTransactionSuccess} = useDeployedResolvers();

    const explorer_url = explorer_urls[Number.parseInt(transaction.chain)];

    useEffect(() => {
        if (receipt) {
            console.log('Transaction Completed', receipt);

            const addressLog = receipt.logs.find((log) => log.topics[0] == '0x4500126d94fb0575f6f62aeaa53ad6d563ed80c940f50c37704c63456432543a');
            // in the format `0x000000000000000000000000e7d827f15fc6ebc85fec6ff28f8817da62c2f158` instead of `0xe7d827f15fc6ebc85fec6ff28f8817da62c2f158`
            const address = addressLog?.data;
            const formattedAddress = address && `0x${address.slice(26)}`;

            logTransactionSuccess(transaction.hash, transaction.chain, formattedAddress as string);
        }
    }, [receipt]);

    return (
        <div className="p-4 border-t">
            <div className="w-full flex justify-between items-center">
                <div>
                    <div className="flex gap-1 items-center">
                        {/* <FiFile /> */}
                    </div>
                    <div className="text-sm flex gap-1 items-center">
                        <FiLoader className="animate-spin size-4 mr-2" />
                        <span className="text-sm">
                            Offchain Resolver
                        </span>
                        <span>on</span>
                        <span>
                            {transaction.chain}
                        </span>
                    </div>
                </div>
                <a href={explorer_url.transaction.replace(":hash", transaction.hash)} target="_blank" className="flex items-center justify-center gap-1 text-sm text-ens-blue hover:underline">
                    Pending <FiExternalLink />
                </a>
            </div>
        </div>
    )
};
