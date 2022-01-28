import { ModuleFeedConfig } from './ModuleFeedConfig';

export type ModuleOptions = {
  feed: (() => ModuleFeedConfig[]) | ModuleFeedConfig[];
};
