import { FC } from "react";
import { TransactionState, useDeployedResolvers } from "../../../stores/deployed_resolvers";
import { useChainId } from "wagmi";
import { Card } from "@ensdomains/thorin";
import { DeployedSOResolver } from "./DeployedResolver";
import { TransactionHistoryEntry } from "./TransactionHistoryEntry";

export const DeployedResolvers = () => {
    const transactions = useDeployedResolvers(e => e.transactions);
    const chain = useChainId();

    const filter_per_chain = false;

    const transactionForChain = filter_per_chain ? transactions.filter(transaction => transaction.chain == chain.toString()) : transactions;

    return (
        <div className="flex flex-col gap-2">
            <Card className="!gap-0 !p-0">
                <div className="p-4">
                    <h2 className="font-bold">Transactions</h2>
                    <span>These are the resolvers you have deployed</span>
                </div>
                <div className="w-full">
                    {
                        transactionForChain.map((transaction) => <TransactionHistoryEntry key={`mod-tx-${transaction.hash}`} transaction={transaction} />).reverse()
                    }
                </div>
            </Card>
        </div>
    )
};
