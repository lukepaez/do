import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { schema } from './init.schema';
export const initRoutes = async (app: FastifyInstance) => {
    app.get(
        '/health',
        { schema },
        async (req: FastifyRequest, res: FastifyReply) => {
            res.send({ status: 'healthy', route: '/health' });
        }
    );
};

// console.log(request.body)
// console.log(request.query)
// console.log(request.params)
// console.log(request.headers)
// console.log(request.raw)
// console.log(request.server)
// console.log(request.id)
// console.log(request.ip)
// console.log(request.ips)
// console.log(request.hostname)
// console.log(request.protocol)
// console.log(request.url)
// console.log(request.routerMethod)
// console.log(request.routeOptions.bodyLimit)
// console.log(request.routeOptions.method)
// console.log(request.routeOptions.url)
// console.log(request.routeOptions.attachValidation)
// console.log(request.routeOptions.logLevel)
// console.log(request.routeOptions.version)
// console.log(request.routeOptions.exposeHeadRoute)
// console.log(request.routeOptions.prefixTrailingSlash)
// console.log(request.routerPath.logLevel)
