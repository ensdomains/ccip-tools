import { Button, Card, FlameSVG, GasPumpSVG, Input, OutlinkSVG, WalletSVG } from "@ensdomains/thorin";
import { useModal } from "connectkit";
import { FactoryABI } from "../../../pages/abi/factory_abi";
import { FC, useEffect, useMemo, useState } from "react";
import { 
  useAccount, 
  useChainId,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useFeeData
} from "wagmi";
import { formatEther, Address } from "viem";
import { useDeployedResolvers } from "../../../stores/deployed_resolvers";

// Regular expressions remain the same
const gatewayRegex = new RegExp("^https://.*$");
const signersRegex = new RegExp("^\\[0x[0-9a-fA-F]{40}(,0x[0-9a-fA-F]{40})*\\]$");

const signersToArray = (signers: string) => {
    if (!signersRegex.test(signers.trim())) return null;
    const n_signers = signers.trim().slice(1, -1).split(',');
    return n_signers;
};

const subdomainChainMap: {[key: number]: string} = {
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

    const { data: feeData } = useFeeData({ 
      chainId, 
      formatUnits: 'gwei' 
    });

    const { logTransaction, logTransactionSuccess } = useDeployedResolvers();

    // Replace usePrepareContractWrite with useSimulateContract
    const { data: simulateData, error } = useSimulateContract({
        address: factoryAddress,
        abi: FactoryABI,
        functionName: 'createOffchainResolver',
        args: [gatewayUrl, signersToArray(signers)],
        chainId
    });

    // Replace useContractWrite with useWriteContract
    const { writeContract, data: hash } = useWriteContract();

    // Replace useWaitForTransaction with useWaitForTransactionReceipt
    const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash: hash,
    });

    const gas = useMemo(() => {
        if (!simulateData || !feeData?.gasPrice) return null;

        const num = BigInt(simulateData.request.gas || 0) * feeData.gasPrice;
        const goerliOffset = 1n;

        return {
            gasTotal: formatEther(num / goerliOffset).substring(0, 8),
        }
    }, [feeData, simulateData]);

    useEffect(() => {
        if (!hash) return;
        logTransaction(hash, chainId.toString());
    }, [hash]);

    useEffect(() => {
        if (!receipt) return;

        const first = receipt.logs[0];
        const address = first.address;

        console.log('Contract Deployed at: ' + address);
        logTransactionSuccess(receipt.transactionHash, chainId.toString(), address);
    }, [receipt]);

    const handleDeploy = async () => {
        if (!simulateData?.request) return;
        
        try {
            await writeContract(simulateData.request);
        } catch (e) {
            console.error('Failed to deploy contract:', e);
        }
    };

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
                onChange={(event) => setGatewayUrl(event.target.value)}
                error={gatewayUrl.trim() !== "" && !isGatewayUrlValid && 'Gateway URL must be a valid https url'}
                placeholder="https://example.com/{sender}/{data}.json"
            />
            <Input
                label="Signers (address[])"
                value={signers}
                onChange={(event) => setSigners(event.target.value)}
                error={signers.trim() !== "" && !isSignersValid && 'Signers must be a valid array of addresses separated by ,'}
                placeholder="[0x225f137127d9067788314bc7fcc1f36746a3c3B5]"
            />

            {!isConnected && (
                <Button onClick={() => setOpen(true)}>
                    Connect Wallet
                </Button>
            )}
            
            {error && (
                <p className="text-red-500">
                    {!Object.keys(subdomainChainMap).includes(chainId.toString())
                        ? `This network is not supported, supported networks: [${Object.values(subdomainChainMap)
                            .map((val) => (val === '' ? 'mainnet' : val))
                            .join(', ')}]`
                        : error.message}
                </p>
            )}

            {simulateData && (
                <div className="flex justify-around items-center">
                    <div className="flex gap-2 items-center">
                        <GasPumpSVG />
                        {feeData?.formatted?.gasPrice}
                    </div>
                    <div className="flex gap-2 items-center">
                        <FlameSVG />
                        {Number(simulateData.request.gas).toLocaleString()}
                    </div>
                    <div className="flex gap-2 items-center">
                        <WalletSVG /> {gas?.gasTotal}
                    </div>
                </div>
            )}

            {(() => {
                if (!isConnected) return null;

                if (receipt) return (
                    <Button 
                        colorStyle="greenPrimary" 
                        suffix={<OutlinkSVG />} 
                        as="a" 
                        target="_blank" 
                        href={`https://${subdomainChainMap[chainId] || ''}etherscan.io/tx/${receipt.transactionHash}#internal`}
                    >
                        View on Etherscan
                    </Button>
                );

                return (
                    <Button 
                        disabled={!isReady || !simulateData || isConfirming} 
                        loading={isConfirming} 
                        onClick={handleDeploy}
                    >
                        {isConfirming ? "Processing" : !simulateData ? 'Estimating Fees...' : `Deploy ${simulateData.request.gas} gas`}
                    </Button>
                );
            })()}
        </Card>
    );
}