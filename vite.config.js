export default {
    base: '/threejs-sprite-utils/',
    server: {
      open: true, // Opens browser automatically
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: "index.html",
          spriteAnimator: "spriteAnimator.html",
          sprite2DOutline: "sprite2DOutline.html",
          spriteAnimatorOutline: "spriteAnimatorOutline.html"
        }
      }
    },
  };