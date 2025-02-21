import { Card, Input, Button } from '@ensdomains/thorin';
import { namehash } from 'viem/ens';
import { FC, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { ENS_Resolver_ABI } from '../../pages/abi/resolver_abi.js';
import { useEnsResolver, usePublicClient } from 'wagmi';

type FormValues = {
    name: string;
};

export const CheckName: FC = () => {
    const { register, handleSubmit } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            name: 'vitalik.eth',
        },
    });

    const publicClient = usePublicClient();

    const [loading, setLoading] = useReducer(
        (loading: number, action: 'incr' | 'decr') => {
            return action === 'incr' ? loading + 1 : loading - 1;
        },
        0
    );

    const onSubmit = handleSubmit(async ({ name }) => {
        try {
            setLoading('incr');

            // Get resolver using wagmi's useEnsResolver hook
            const { data: resolver } = useEnsResolver({
                name,
            });

            if (resolver) {
                alert(resolver);

                // Read avatar using the resolver contract
                const data = await publicClient?.readContract({
                    address: resolver,
                    abi: ENS_Resolver_ABI,
                    functionName: 'avatar',
                    args: [namehash(name)],
                });

                alert(JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching ENS data');
        } finally {
            setLoading('decr');
        }
    });

    return (
        <Card>
            <form onSubmit={onSubmit}>
                <h2 className="font-bold">CheckName</h2>
                <div className="flex flex-col gap-4 mt-2">
                    <Input
                        label=""
                        placeholder="vitalik.eth"
                        {...register('name')}
                    />
                    <Button type="submit" loading={loading > 0}>
                        Check
                    </Button>
                </div>
            </form>
        </Card>
    );
};
