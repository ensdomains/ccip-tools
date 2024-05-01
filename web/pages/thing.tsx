import { lightTheme, ThorinGlobalStyles } from '@ensdomains/thorin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { FC, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { goerli, holesky, mainnet, sepolia } from 'wagmi/chains';

import { ProfileButton } from '../components/molecules/ProfileButton';

const client = createConfig({
    chains: [goerli, mainnet, holesky, sepolia],
    transports: {
        [mainnet.id]: http(),
        [goerli.id]: http('https://eth-goerli.public.blastapi.io'),
        [holesky.id]: http(),
        [sepolia.id]: http(),
    },
});

const queryClient = new QueryClient();

export const Thing: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider theme={lightTheme}>
            <ThorinGlobalStyles />
            <WagmiProvider config={client}>
                <QueryClientProvider client={queryClient}>
                    <ConnectKitProvider>
                        <div className="flex justify-end p-2 md:absolute right-0 top-0 w-full md:w-fit">
                            <ProfileButton />
                        </div>
                        <div className="w-full max-w-xl mx-auto mt-2 md:mt-12 px-4 mb-24">
                            {children}
                        </div>
                    </ConnectKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ThemeProvider>
    );
};
