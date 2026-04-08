import { createContext, type ReactNode, useContext } from 'react';
import type { Logger } from './logger.interface';

const LoggerContext = createContext<Logger | null>(null);

export const LoggerProvider = ({
    logger,
    children,
}: {
    logger: Logger;
    children: ReactNode;
}) => (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
);

export const useLogger = (): Logger => {
    const logger = useContext(LoggerContext);
    if (!logger)
        throw new Error('useLogger must be used within a LoggerProvider');
    return logger;
};
