import { formatAddress } from "@ens-tools/format";
import { Dialog, Button, Input } from "@ensdomains/thorin";
import { FC, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { chainIdToName, etherscanAddressURL } from "../../../util/deployments";
import { Address } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

export const SetUrlDialog: FC<{ chain: number, resolver: Address, current_value?: string, onClose?: () => void }> = ({ chain, resolver, current_value, onClose }) => {
    const { address } = useAccount();
    const [newValue, setNewValue] = useState<string>(current_value || "");
    const { writeContract, error } = useWriteContract({});
    const { data: owner } = useReadContract({
        address: resolver,
        chainId: chain,
        abi: [{ name: 'owner', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: 'owner', type: 'string' }] }] as const,
        functionName: 'owner',
        args: []
    });

    const isOwner = owner == address;
    const isReady = !!newValue && newValue !== current_value && isOwner;

    const chainName = chainIdToName(chain);

    return (
        <Dialog
            open={true}
            title="Set URL for Offchain Resolver"
            subtitle={"Update the URL for your offchain resolver " + formatAddress(resolver) + " on " + chainName}
            variant="closable"
            onClose={onClose}
            onDismiss={() => { }}
        >
            <div className="w-screen max-w-lg flex-col flex gap-4">
                <Input
                    label="Resolver Address"
                    defaultValue={resolver}
                    value={resolver}
                    suffix={
                        <div>
                            {chainName}
                        </div>
                    }
                />
                <Input
                    label="New Gateway URL"
                    placeholder="https://example.com/{sender}/{data}"
                    defaultValue={current_value}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                />
                {
                    isOwner &&
                    <div className="bg-ens-greenlight p-2 flex items-center gap-1">
                        <FiCheck />
                        You are owner.
                    </div>
                }
                {
                    !isOwner && owner &&
                    <div className="bg-ens-redlight p-2 flex items-center gap-1">
                        <FiCheck />
                        You are NOT owner. (see <a href={etherscanAddressURL(chain, owner)}>{formatAddress(owner)}</a>)
                    </div>
                }
                {
                    !isOwner && !owner &&
                    <div className="bg-ens-redlight p-2 flex items-center gap-1">
                        <FiX />
                        Ownership not available on this version.
                    </div>
                }
                <Button onClick={() => {
                    writeContract({
                        abi: [{ name: 'setURL', type: 'function', stateMutability: 'external', inputs: [{ name: '_url', type: 'string' }], outputs: [] }],
                        address: resolver,
                        chainId: chain,
                        functionName: 'setURL',
                        args: [newValue],
                        account: address
                    })
                }} disabled={!isReady}>
                    Update URL
                </Button>
            </div>
        </Dialog>
    );
};
