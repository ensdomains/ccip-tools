import {
    Banner,
    Button,
    Card,
    FlameSVG,
    GasPumpSVG,
    Input,
    Select,
    WalletSVG,
} from '@ensdomains/thorin';
import { useModal } from 'connectkit';
import { FactoryABI } from '../../../pages/abi/factory_abi';
import { FC,useState } from 'react';
import {
    useAccount,
    useChainId,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from 'wagmi';
import { useDeployedResolvers } from '../../../stores/deployed_resolvers';
import { SORDeployments, isSOREnabled } from '../../../util/deployments';

// Regular expressions remain the same
const gatewayRegex = new RegExp('^https://.*$');
const signersRegex = new RegExp(
    '^\\[0x[0-9a-fA-F]{40}(,0x[0-9a-fA-F]{40})*\\]$'
);

const signersToArray = (signers: string) => {
    if (!signersRegex.test(signers.trim())) return null;
    const n_signers = signers.trim().slice(1, -1).split(',');
    return n_signers;
};

const subdomainChainMap: { [key: number]: string } = {
    1: '',
    17000: 'holesky.',
    11155111: 'sepolia.',
};

// Component that deploys the Simple Offchain Resolver\
// This resolver signs its output with a public private key-pair.
export const DeployResolverCard: FC = () => {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { setOpen } = useModal();
    const [gatewayUrl, setGatewayUrl] = useState<string>('');
    const [signers, setSigners] = useState<string>('');

    const isGatewayUrlValid = gatewayRegex.test(gatewayUrl.trim());
    const isSignersValid = signersRegex.test(signers.trim());

    const enabledOnChain = isSOREnabled(chainId);
    const isReadyForChain = enabledOnChain === 'available';

    const isReady = isGatewayUrlValid && isSignersValid && isReadyForChain;

    const factoryAddress = SORDeployments[chainId]?.[0]?.factory;

    const { logTransaction } = useDeployedResolvers();

    const {
        data: EstimateData,
        error,
        isSuccess,
        isLoading,
    } = useSimulateContract(
        isReady
            ? {
                  address: factoryAddress,
                  abi: FactoryABI,
                  functionName: 'createOffchainResolver',
                  args: [gatewayUrl, signersToArray(signers)],
              }
            : undefined
    );

    const { chains, switchChain } = useSwitchChain();

    const { writeContract } = useWriteContract();

    return (
        <Card className="leading-6 gap-2">
            <div className="">
                <h2 className="font-bold">Deploy an Offchain Resolver</h2>
                <p className="text-neutral-700 mt-2">
                    In order to use a gateway, you need to deploy a resolver to
                    mainnet. We will help you deploy your{' '}
                    <a
                        className="link"
                        href="https://github.com/ensdomains/ccip-tools/blob/master/contracts/OffchainResolver.sol"
                    >
                        OffchainResolver
                    </a>
                    .
                </p>
            </div>

            <Select
                label={'ENS Deployment'}
                value={chainId.toString()}
                options={chains.map((chain) => ({
                    value: chain.id.toString(),
                    label: chain.name,
                    node: (
                        <div className="flex justify-between">
                            <div>{chain.name}</div>
                            <div>
                                {(() => {
                                    switch (isSOREnabled(chain.id)) {
                                        case 'available':
                                            return (
                                                <span className="text-green-500">
                                                    Available
                                                </span>
                                            );
                                        case 'deprecated':
                                            return (
                                                <span className="text-yellow-500">
                                                    Deprecated
                                                </span>
                                            );
                                        case 'unavailable':
                                            return (
                                                <span className="text-red-500">
                                                    Unavailable
                                                </span>
                                            );
                                    }
                                })()}
                            </div>
                        </div>
                    ),
                }))}
                onChange={(event) => {
                    switchChain({
                        chainId: Number.parseInt(event.target.value),
                    });
                }}
            />

            <Input
                label="Gateway URL"
                value={gatewayUrl}
                onChange={(event) => setGatewayUrl(event.target.value)}
                error={
                    gatewayUrl.trim() !== '' &&
                    !isGatewayUrlValid &&
                    'Gateway URL must be a valid https url'
                }
                placeholder="https://example.com/{sender}/{data}.json"
            />
            <Input
                label="Signers (address[])"
                value={signers}
                onChange={(event) => setSigners(event.target.value)}
                error={
                    signers.trim() !== '' &&
                    !isSignersValid &&
                    'Signers must be a valid array of addresses separated by ,'
                }
                placeholder="[0x225f137127d9067788314bc7fcc1f36746a3c3B5]"
            />

            {!isConnected && (
                <Button
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Connect Wallet
                </Button>
            )}
            {error && (
                <p className="text-red-500">
                    {!Object.keys(subdomainChainMap).includes(
                        chainId.toString()
                    )
                        ? `This network is not supported, supported networks: [${Object.values(
                              subdomainChainMap
                          )
                              .map((val) => (val === '' ? 'mainnet' : val))
                              .join(', ')}]`
                        : error.message}
                </p>
            )}
            {EstimateData && (
                <div className="flex justify-around items-center">
                    <div className="flex gap-2 items-center">
                        <GasPumpSVG />
                        {EstimateData.request.gasPrice?.toString()}
                    </div>
                    <div className="flex gap-2 items-center">
                        <FlameSVG />
                        {Number(EstimateData.request.gas).toLocaleString()}
                    </div>
                    <div className="flex gap-2 items-center">
                        <WalletSVG />
                    </div>
                </div>
            )}

            <Banner alert="warning" title="Under Construction">
                This section of the site is undergoing maintenance to support
                multiple versions & networks.
            </Banner>
            {(() => {
                if (!isConnected) return null;

                // if (receipt.isSuccess) return (
                //     <Button colorStyle="greenPrimary" suffix={<OutlinkSVG />} as="a" target="_blank" href={
                //         `https://${subdomainChainMap[chainId] || ''}etherscan.io/tx/${receipt.data?.transactionHash}#internal`
                //     }>View on Etherscan</Button>
                // );

                return (
                    <Button
                        disabled={!isReady}
                        onClick={() => {
                            writeContract(
                                {
                                    abi: FactoryABI,
                                    address: factoryAddress,
                                    chainId,
                                    functionName: 'createOffchainResolver',
                                    args: [gatewayUrl, signersToArray(signers)],
                                },
                                {
                                    onSuccess(data, variables, context) {
                                        logTransaction(
                                            data,
                                            chainId.toString()
                                        );
                                    },
                                }
                            );
                        }}
                    >
                        {isLoading
                            ? 'Estimating Fees...'
                            : isSuccess
                            ? 'Deploy ' + EstimateData?.request.gas + ' gas'
                            : 'Deploy'}
                    </Button>
                );
            })()}
        </Card>
    );
};
