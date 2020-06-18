const { task, src, dest } = require('gulp')
const { include, compilerOptions } = require('./tsconfig.json')

/**
 * Copies the `.d.ts` files one-to-one from source to destination.
 * @param {string | string[]} sourceGlobs Location of source file(s), executed in order if mutiple locations are specified.
 * @param {string} destinationFolder Where to copy the `sourceGlobs` to.
 */
const buildTs = (sourceGlobs, destinationFolder) => async () => {
  src(sourceGlobs).pipe(dest(destinationFolder))
}

task('build:ts', buildTs(include, compilerOptions.outDir))
