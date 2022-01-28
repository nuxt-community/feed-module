import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/module'],
  externals: ['@nuxt/kit', '@nuxt/schema', 'vue'],
  declaration: true
});
