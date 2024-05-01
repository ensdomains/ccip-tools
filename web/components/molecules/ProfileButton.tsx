import { Button, Profile, Select } from '@ensdomains/thorin';
import { useModal } from 'connectkit';
import { useAccount, useChainId, useEnsAvatar, useEnsName, useSwitchChain } from 'wagmi';

export const ProfileButton = () => {
    const { setOpen } = useModal();
    const { address } = useAccount();
    const { data: name } = useEnsName({ address });
    const { data: avatar } = useEnsAvatar({ name: name! });
    const chainId = useChainId();
    const { chains, switchChain } = useSwitchChain();

    return (
        <div className="flex items-center gap-1 z-10">
            {
                address &&
                <>
                    <Select
                        label={undefined}
                        hideLabel
                        value={chainId.toString()}
                        options={chains.map((chain) => ({
                            value: chain.id.toString(),
                            label: chain.name,
                        }))}
                        onChange={(event) => {
                            switchChain({
                                chainId: Number.parseInt(event.target.value),
                            });
                        }}
                    />
                    <button onClick={() => setOpen(true)}>

                        <Profile address={address || ''} ensName={name || ''} avatar={avatar || ''} />
                    </button>
                </>
            }
            {
                !address &&
                <Button onClick={() => setOpen(true)}>
                    Connect Wallet
                </Button>
            }
        </div>
    );
};
