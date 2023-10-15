# @koobiq/logger

It's the package with a utility for displaying the log on the client side.

## Examples

Message:

```js
import { logger } from '@koobiq/logger';

logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

Message once:

```js
import { once } from '@koobiq/logger';

once.info('Info message');
once.warn('Warning message');
once.error('Error message');
```

Deprecated:

```js
import { deprecate } from '@koobiq/logger';

deprecate('Deprecated annotation');
```
