export const cx = (...arguments_: any[]) => {
    return arguments_.filter(Boolean).join(' ');
};
