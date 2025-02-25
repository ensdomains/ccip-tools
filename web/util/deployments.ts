import { Address } from 'viem';
import { holesky, mainnet, sepolia } from 'viem/chains';

type SORVersion = '1' | '2';

type SORDeployment = {
    factory: Address;
    version: SORVersion;
};

export const isSOREnabled = (chainId: number) => {
    if (chainId == 5) return 'deprecated';
    if (
        SORDeployments.hasOwnProperty(chainId) &&
        SORDeployments[chainId].length > 0
    )
        return 'available';
    return 'unavailable';
};

export const SORDeployments: Record<number, SORDeployment[]> = {
    [mainnet.id]: [
        {
            factory: '0x77020a1Cb2d4a0AE6CC773Cc726c1EfdEC0a50ab',
            version: '1',
        },
    ],
    [holesky.id]: [
        { 
            factory: '0x35D55712B7fe7Fc9C021dAb7A4773bbF89e1F25e', 
            version: '1' 
        },
    ],
    [sepolia.id]: [
        {
            factory: '0x0Fde82e81270431F2B956E7ce7E8860B2F61bcF9',
            version: '1',
        },
    ],
};

export const explorer_urls: Record<
    number,
    {
        transaction: string;
        address: string;
    }
> = {
    1: {
        transaction: 'https://etherscan.io/tx/:hash',
        address: 'https://etherscan.io/address/:address',
    },
    17_000: {
        transaction: 'https://holesky.etherscan.io/tx/:hash',
        address: 'https://holesky.etherscan.io/address/:address',
    },
    11_155_111: {
        transaction: 'https://sepolia.etherscan.io/tx/:hash',
        address: 'https://sepolia.etherscan.io/address/:address',
    },
};

export const etherscanAddressURL = (chain: number, address: string) => {
    return explorer_urls[chain].address.replace(':address', address);
};

export const chainIdToName = (chainId: number) => {
    return chainId == 1
        ? 'Mainnet'
        : chainId == 17000
        ? 'Holesky'
        : chainId == 11155111
        ? 'Sepolia'
        : 'Unknown';
};
