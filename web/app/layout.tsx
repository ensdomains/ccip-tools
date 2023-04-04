import { ReactNode } from 'react';

export const metadata = {
    title: 'CCIP Tools',
    description: 'Cross Chain Interoperability Protocol testing tool.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
