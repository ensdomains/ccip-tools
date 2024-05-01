import { FC } from "react";
import { TransactionState } from "../../../stores/deployed_resolvers";
import { DeployedSOResolver } from "./DeployedResolver";
import { PendingResolver } from "./PendingResolver";

export const TransactionHistoryEntry: FC<{ transaction: TransactionState }> = ({ transaction }) => {
    if (transaction.status == 'pending') {
        return (
            <PendingResolver transaction={transaction} />
        );
    }

    if (transaction.status == 'deployed') {
        return (
            <DeployedSOResolver transaction={transaction} />
        );
    }

    return (
        <div>
            Unknown Transaction Entry
        </div>
    );
};
