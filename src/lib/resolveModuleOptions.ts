import { FeedConfig, FeedConfigFactory } from '../types';

export async function resolveModuleOptions(
  options: FeedConfigFactory | FeedConfig[]
) {
  if (typeof options === 'function') {
    return await options();
  } else if (Array.isArray(options)) {
    return options;
  } else {
    throw new TypeError('Invalid module options');
  }
}
