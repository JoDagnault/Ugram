import type { ComponentPropsWithoutRef } from 'react';

interface UgramLetteringProps extends ComponentPropsWithoutRef<'p'> {
    className?: string;
}

export default function UgramLettering({
    className = '',
    ...props
}: UgramLetteringProps) {
    return (
        <p className={`font-secondary ${className}`} {...props}>
            Ugram
        </p>
    );
}
