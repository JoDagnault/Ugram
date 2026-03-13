declare global {
    namespace Express {
        interface Request {
            userId: string;
            userLogger: {
                info: (msg: string, meta?: Record<string, unknown>) => void;
                warn: (msg: string, meta?: Record<string, unknown>) => void;
                error: (msg: string, meta?: Record<string, unknown>) => void;
                http: (msg: string, meta?: Record<string, unknown>) => void;
                debug: (msg: string, meta?: Record<string, unknown>) => void;
            };
        }
    }
}

export {};
