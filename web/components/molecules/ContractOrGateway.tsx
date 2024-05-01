import { motion } from 'framer-motion';
import { FC } from 'react';

import { cx } from '../../util/cx';

export const ContractOrRegister: FC<{
    value: number;
    setValue: (value: number) => void;
}> = ({ value, setValue }) => {
    return (
        <div className="bg-white border rounded-md w-full h-12 flex relative p-1 overflow-hidden">
            <div className="relative h-full w-full flex justify-around text-white">
                <motion.div
                    className="bg-ens-blue h-full w-[49%] rounded-md absolute left-0"
                    animate={{ x: value === 0 ? 0 : '100%' }}
                ></motion.div>
                <button
                    className={cx(
                        'z-10 w-full h-full flex items-center justify-center font-bold',
                        value == 0
                            ? 'text-white'
                            : 'text-ens-blue cursor-pointer'
                    )}
                    onClick={() => {
                        setValue(0);
                    }}
                >
                    Contract
                </button>
                <button
                    className={cx(
                        'z-10 w-full h-full flex items-center justify-center font-bold',
                        value == 1
                            ? 'text-white'
                            : 'text-ens-blue cursor-pointer'
                    )}
                    onClick={() => {
                        setValue(1);
                    }}
                >
                    Gateway
                </button>
            </div>
        </div>
    );
};
