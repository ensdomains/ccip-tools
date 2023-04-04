import { Card, Input, Button } from '@ensdomains/thorin';
import { namehash } from 'viem/ens';
import { FC, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ENS_Resolver_ABI } from '../../pages/abi/resolver_abi.js';
import { useContractRead, useEnsName, useProvider } from 'wagmi';

type FormValues = {
    name: string;
};

export const CheckName: FC = () => {
    const { register, formState, handleSubmit } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            name: 'vitalik.eth',
        }
    });
    const name = 'lucemansnl.twitter.ngo';

    // const {data} = useContractRead(
    //     {
    //         abi: ENS_Resolver_ABI,
    //         address: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    //         functionName: 'addr',
    //         args: [
    //             namehash(name),
    //             // encodeFunctionData({
    //             //   abi: text_resolver_abi,
    //             //   functionName: 'text',
    //             //   args: [namehash(name), key],
    //             // }),
    //         ],
    //     }
    // );
    const provider = useProvider();

    const [loading, setLoading] = useReducer((loading: number, action: 'incr' | 'decr') => {
        return action === 'incr' ? loading + 1 : loading - 1;
    }, 0);

    const onSubmit = handleSubmit(async ({ name }) => {
        setLoading('incr');
        const resolver = await provider.getResolver(name);

        alert(resolver?.address);

        const data = await resolver?.getAvatar();

        alert(JSON.stringify(data));
        setLoading('decr');
    });

    return (
        <Card>
            <form onSubmit={onSubmit}>
                <h2 className="font-bold">CheckName</h2>
                <div className="flex flex-col gap-4 mt-2">
                    <Input label="" placeholder="vitalik.eth" {...register('name')} />
                    <Button type="submit" loading={loading > 0}>
                        Check
                    </Button>
                </div>
            </form>
        </Card>
    );
};
