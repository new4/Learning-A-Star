var gulp = require("gulp");
var ts = require("gulp-typescript");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

var paths = {
  "html": {
    "src": [ "src/*.html" ],
    "dist": "example"
  },
  "ts": {
    "src": [ "src/ts/*.ts" ],
    "dist": "dist"
  },
  "css": {
    "src": [ "src/css/*.css" ],
    "dist": "example/css"
  }
}

gulp.task( "tsHandler", function(){
  // gulp.src( paths.ts.src )
  //     .pipe( ts({
  //       // "target": "es5"
  //       "module": "amd",
  //       "outFile": "astar.js"
  //     }))
  //     .pipe( gulp.dest( paths.ts.dist ) );

    browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));

});

gulp.task( 'htmlHandler', function(){
  gulp.src( paths.html.src )
      .pipe( gulp.dest( paths.html.dist ) );
});

gulp.task( 'cssHandler', function(){
  gulp.src( paths.css.src )
      .pipe( gulp.dest( paths.css.dist ) );
});

gulp.task( 'default', [ 'tsHandler', 'htmlHandler', 'cssHandler' ] );

gulp.watch( [].concat( paths.html.src, paths.ts.src, paths.css.src ), [ 'tsHandler', 'htmlHandler', 'cssHandler' ] );
