// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
// import { nodeResolve } from '@rollup/plugin-node-resolve';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    // externalImportAttributes: true, 
  },
  external: ['fastify'],
  plugins: [
    // commonjs(),
    // json(),
    // nodeResolve({ preferBuiltins: true }),
    typescript(),
  ],
}

export default config;
