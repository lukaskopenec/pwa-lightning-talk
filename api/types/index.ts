import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { types } from '../data/refreshments';

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
    context.log('GET request to /types');

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: types,
    };

};

export default httpTrigger;