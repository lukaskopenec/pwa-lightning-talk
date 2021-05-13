import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { ErrorCause } from '../models';
import { stocks, validType } from '../data/refreshments';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { refreshmentType, quantity } = req.body;
  context.log(`Order ${quantity} of ${refreshmentType}`);

  if (!validType(refreshmentType)) {
    context.res = {
      status: 400,
      body: {
        cause: ErrorCause.UnknownId,
        message: `Unknown refreshment type id ${refreshmentType}`,
      },
    };
    return;
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    context.res = {
      status: 400,
      body: {
        cause: ErrorCause.InvalidQuantity,
        message: `Invalid quantity ${quantity}`,
      },
    };
    return;
  }

  const available = stocks.get(refreshmentType);
  if (available < quantity) {
    context.res = {
      status: 400,
      body: {
        cause: ErrorCause.InvalidQuantity,
        message: `We don\'t have enough stocks to satisfy your order`,
      },
    };
  }

  stocks.set(refreshmentType, available - quantity);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: { refreshmentType, quantity }
  };

};

export default httpTrigger;