import { ModuleOptions } from 'src/types/ModuleOptions';

export function parseModuleOptions({ feed }: ModuleOptions) {
  if (typeof feed === 'function') {
    return feed();
  } else if (Array.isArray(feed)) {
    return feed;
  } else {
    throw new Error('Invalid module config');
  }
}
