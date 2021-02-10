require('esbuild').build({
  entryPoints: ['src/client/index.js'],
  bundle: true,
  outfile: 'public/index.js',
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  sourcemap: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.error('watch build succeeded:', result)
    },
  },
}).catch(() => process.exit());

