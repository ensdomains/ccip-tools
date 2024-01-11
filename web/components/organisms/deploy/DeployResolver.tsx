import { Button, Card, FlameSVG, GasPumpSVG, Input, OutlinkSVG, WalletSVG } from "@ensdomains/thorin";
import { useChains, useModal } from "connectkit";
import { FactoryABI } from "../../../pages/abi/factory_abi";
import { FC, useEffect, useMemo, useState } from "react";
import { Address, useAccount, useChainId, useContractWrite, useFeeData, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { formatEther } from "viem";
import { useDeployedResolvers } from "../../../stores/deployed_resolvers";

// https url that must include '{sender}'
// const gatewayRegex = new RegExp("^https://.*{sender}.*$");
const gatewayRegex = new RegExp("^https://.*$");
// address[] that must include 0x and are seperated by ,
const signersRegex = new RegExp("^\\[0x[0-9a-fA-F]{40}(,0x[0-9a-fA-F]{40})*\\]$");

const signersToArray = (signers: string) => {
    if (!signersRegex.test(signers.trim())) return null;
    const n_signers = signers.trim().slice(1, -1).split(',');

    return n_signers;
};

const subdomainChainMap = {
    1: '',
    5: 'goerli.',
    11155111: 'sepolia.'
}

const deployments: Record<number, {
    factory?: Address,
    resolver?: Address,
}> = {
    1: {
        factory: '0xf9196c7fc786996eb5eb95118d828d505ef73bf9',
    },
    5: {
        factory: '0x2F180aDBAAb3c57af31B7E96969999D4FB33faEE',
    },
    11155111: {
        factory: '0x0Fde82e81270431F2B956E7ce7E8860B2F61bcF9'
    }
}

export const DeployResolverCard: FC = () => {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { setOpen } = useModal();
    const [gatewayUrl, setGatewayUrl] = useState<string>("");
    const [signers, setSigners] = useState<string>("");

    const isGatewayUrlValid = gatewayRegex.test(gatewayUrl.trim());
    const isSignersValid = signersRegex.test(signers.trim());

    const isReady = isGatewayUrlValid && isSignersValid;

    const factoryAddress = deployments[chainId]?.factory;

    const { data: FeeData } = useFeeData({ chainId, formatUnits: chainId == 5 ? 'kwei' : 'gwei' });

    const { transactions, logTransaction, logTransactionSuccess } = useDeployedResolvers();

    const { config, data: EstimateData, error, isSuccess, isLoading } = usePrepareContractWrite({
        address: factoryAddress,
        chainId,
        functionName: 'createOffchainResolver',
        args: [gatewayUrl, signersToArray(signers)],
        abi: FactoryABI,
        enabled: isReady,
    });
    const { write, data } = useContractWrite(config);
    const receipt = useWaitForTransaction(data);

    const gas = useMemo(() => {
        if (!EstimateData) return null;
        if (!FeeData) return null;
        if (!FeeData.gasPrice) return null;

        const num = FeeData.gasPrice.mul(EstimateData.request.gasLimit);
        const goerliOffset = chainId == 5 ? 1000n : 1n;

        return {
            // Is it me or is goerli fee data off by /1000
            gasTotal: formatEther(num.toBigInt() / goerliOffset, 'gwei').substring(0, 8),
        }
    }, [FeeData, EstimateData]);

    console.log({ receipt: receipt?.data });

    useEffect(() => {
        if (!data) return;

        logTransaction(data.hash, chainId.toString());
    }, [data]);

    useEffect(() => {
        if (!receipt?.data) return;

        const x = receipt.data;

        const first = x.logs[0];
        const address = first.address;

        console.log('Contracted Deployed at: ' + address);

        logTransactionSuccess(receipt.data.transactionHash, chainId.toString(), address);
    }, [receipt?.data]);

    return (
        <Card className="leading-6 gap-2">
            <div className="">
                <h2 className="font-bold">Deploy an Offchain Resolver</h2>
                <p className="text-neutral-700 mt-2">
                    In order to use a gateway, you need to deploy a resolver to mainnet.
                    We will help you deploy your <a className="link" href="https://github.com/ensdomains/ccip-tools/blob/master/contracts/OffchainResolver.sol">OffchainResolver</a>.
                </p>
            </div>

            <Input
                label="Gateway URL"
                value={gatewayUrl}
                onChange={
                    (event) => {
                        setGatewayUrl(event.target.value);
                    }
                }
                error={gatewayUrl.trim() !== "" && !isGatewayUrlValid && 'Gateway URL must be a valid https url that includes "{sender}"'}
                placeholder="https://example.com/{sender}/{data}.json"
            />
            <Input
                label="Signers (address[])"
                value={signers}
                onChange={
                    (event) => {
                        setSigners(event.target.value);
                    }
                }
                error={signers.trim() !== "" && !isSignersValid && 'Signers must be a valid array of addresses seperated by ,'}
                placeholder="[0x225f137127d9067788314bc7fcc1f36746a3c3B5]"
            />

            {
                !isConnected && (
                    <Button onClick={() => { setOpen(true) }}>
                        Connect Wallet
                    </Button>
                )
            }
            {
                error && (
                    <p className="text-red-500">
                        {(chainId !== 5 || chainId !== 11155111) ? 'Only Goerli and Sepolia is supported right now' : error.message}
                    </p>
                )
            }
            {
                EstimateData && (
                    <div className="flex justify-around items-center">
                        <div className="flex gap-2 items-center">
                            <GasPumpSVG />
                            {FeeData?.formatted?.gasPrice}
                        </div>
                        <div className="flex gap-2 items-center">
                            <FlameSVG />
                            {Number(EstimateData.request.gasLimit).toLocaleString()}
                        </div>
                        <div className="flex gap-2 items-center">
                            <WalletSVG /> {gas?.gasTotal}
                        </div>
                    </div>
                )
            }
            {
                (() => {
                    if (!isConnected) return null;

                    if (receipt.isSuccess) return (
                        <Button colorStyle="greenPrimary" suffix={<OutlinkSVG />} as="a" target="_blank" href={
                            `https://${subdomainChainMap[chainId] || ''}etherscan.io/tx/${receipt.data?.transactionHash}#internal`
                        }>View on Etherscan</Button>
                    );

                    return (
                        <Button disabled={!isReady || !write || receipt.isLoading} loading={receipt.isLoading} onClick={() => write?.()}>
                            {receipt.isLoading ? "Processing" : isLoading ? 'Estimating Fees...' : isSuccess ? 'Deploy ' + EstimateData?.request.gasLimit + ' gas' : 'Deploy'}
                        </Button>
                    );
                })()
            }
        </Card>
    )
};
