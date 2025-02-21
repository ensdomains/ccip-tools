import { lightTheme, ThorinGlobalStyles } from '@ensdomains/thorin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { FC, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';

const client = createConfig({
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http(),
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
                        <div className="w-full max-w-lg mx-auto mt-12 px-4">
                            {children}
                        </div>
                    </ConnectKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ThemeProvider>
    );
};
