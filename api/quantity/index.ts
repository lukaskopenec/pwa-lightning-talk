import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { ErrorCause } from '../models';

import { stocks, validType } from '../data/refreshments';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const typeId = +req.params.typeId;
    context.log('Get quantity of', typeId);
    
    if (!validType(typeId)) {
        context.res = {
            status: 400,
            body: {
                cause: ErrorCause.UnknownId,
                message: `Unknown refreshment type id ${typeId}`,
            },
        };
        return;
    }


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            id: typeId,
            quantity: stocks.get(typeId),
        }
    };

};

export default httpTrigger;