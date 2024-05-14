import { Injectable,NestMiddleware,Logger } from "@nestjs/common";
import { Request, Response, NextFunction} from 'express';

@Injectable()
// middleware to URL, method, time taken to execute the request and response status code
export class LoggerMiddleware implements NestMiddleware {
    private logger=new Logger('HTTP');
    use(req:Request, res:Response, next:NextFunction){
        const currentTime=Date.now();
        res.on('finish',()=>{
            const passedTime = Date.now()-currentTime;
            const { method, originalUrl } = req;
            const { statusCode } = res;
            this.logger.log(`${method} ${originalUrl} ${statusCode} ${passedTime} ms`);
        })
        next();
    }
} 