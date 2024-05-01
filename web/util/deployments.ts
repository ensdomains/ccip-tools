import { Address } from "viem";
import { goerli, holesky, mainnet, sepolia } from "viem/chains";

type SORVersion = '1' | '2';

type SORDeployment = {
    factory: Address,
    version: SORVersion,
};

export const SORDeployments: Record<number, SORDeployment[]> = {
    [mainnet.id]: [
        {
            factory: '0x77020a1Cb2d4a0AE6CC773Cc726c1EfdEC0a50ab',
            version: '1',
        },
    ],
    [goerli.id]: [
        {
            factory: '0x2F180aDBAAb3c57af31B7E96969999D4FB33faEE',
            version: '1',
        },
    ],
    [sepolia.id]: [
        {
            factory: '0x0Fde82e81270431F2B956E7ce7E8860B2F61bcF9',
            version: '1',
        },
    ],
    [holesky.id]: [
        // TODO: Deploy to Holesky
    ],
};

export const explorer_urls: Record<number, {
    transaction: string,
    address: string,
}> = {
    1: {
        transaction: 'https://etherscan.io/tx/:hash',
        address: 'https://etherscan.io/address/:address'
    },
    5: {
        transaction: 'https://goerli.etherscan.io/tx/:hash',
        address: 'https://goerli.etherscan.io/address/:address'
    },
    11155111: {
        transaction: 'https://sepolia.etherscan.io/tx/:hash',
        address: 'https://sepolia.etherscan.io/address/:address'
    },
};
