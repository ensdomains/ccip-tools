import { type } from 'os';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TransactionStatePending = { status: 'pending', hash: string, chain: string };
export type TransactionStateDeployed = { status: 'deployed', hash: string, chain: string, contract_address: string };

export type TransactionState = TransactionStatePending | TransactionStateDeployed;

interface DeployedResolverState {
    transactions: TransactionState[];
    logTransaction: (transaction_hash: string, chain_id: string) => void;
    logTransactionSuccess: (transaction_hash: string, chain_id: string, contract_address: string) => void;
}

export const useDeployedResolvers = create(
    persist<DeployedResolverState>(
        (set) => ({
            transactions: [],
            logTransaction(transaction_hash, chain_id) {
                set((state) => ({ transactions: [...state.transactions, { status: 'pending', hash: transaction_hash, chain: chain_id }] }))
            },
            logTransactionSuccess(transaction_hash, chain_id, contract_address) {
                set((state): Partial<DeployedResolverState> => {
                    const transactions = state.transactions.map((transaction) => {
                        if (transaction.hash === transaction_hash) {
                            return { ...transaction, status: 'deployed', contract_address } as TransactionStateDeployed;
                        } else {
                            return transaction;
                        }
                    });

                    return { transactions };
                })
            },
        }), { name: '@ccip-tools/resolvers', storage: createJSONStorage(() => localStorage) }));
