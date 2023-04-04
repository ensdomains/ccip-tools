export const cx = (...args: any[]) => {
    return args.filter(Boolean).join(' ');
}
