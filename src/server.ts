import { register } from './index';

const app = register();

// serve app
app.listen(
    {
        port: 5000,
        listenTextResolver: addr => {
            return `do server is listening at ${addr}`;
        },
    },
    error => {
        if (error) {
            app.log.error(error);
            process.exit(1);
        }
    }
);
