import { FeedSource, FeedSourcesFactory } from '../types';

export function resolveModuleOptions(
  options: FeedSourcesFactory | FeedSource[]
) {
  if (typeof options === 'function') {
    return options();
  } else if (Array.isArray(options)) {
    return options;
  } else {
    throw new TypeError('Invalid module options');
  }
}
