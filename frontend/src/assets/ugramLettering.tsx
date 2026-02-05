import type { ComponentPropsWithoutRef } from 'react';

interface UgramLetteringProps extends ComponentPropsWithoutRef<'p'> {
    className?: string;
}

export default function UgramLettering({
    className = '',
    ...props
}: UgramLetteringProps) {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Climate+Crisis:YEAR@1990&display=swap"
                rel="stylesheet"
            />
            <p
                className={className}
                style={{
                    fontFamily: '"Climate Crisis", sans-serif',
                    fontOpticalSizing: 'auto',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontVariationSettings: '"YEAR" 1990',
                    ...props.style,
                }}
                {...props}
            >
                Ugram
            </p>
        </>
    );
}
