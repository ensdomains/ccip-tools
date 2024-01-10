import { lightTheme, ThorinGlobalStyles } from '@ensdomains/thorin';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { FC, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { createClient, mainnet, WagmiConfig } from 'wagmi';
import { goerli, sepolia } from 'wagmi/chains';

const client = createClient(getDefaultClient({ appName: 'CCIP Tools', chains: [goerli, mainnet, sepolia] }));

export const Thing: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider theme={lightTheme}>
            <ThorinGlobalStyles />
            <WagmiConfig client={client}>
                <ConnectKitProvider>
                    <div className="w-full max-w-lg mx-auto mt-12 px-4">
                        {children}
                    </div>
                </ConnectKitProvider>
            </WagmiConfig>
        </ThemeProvider>
    );
};
