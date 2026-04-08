import app from './app';
import { config } from './config/config';

const HOST = '0.0.0.0';

app.listen(config.server.PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${config.server.PORT}`);
});
