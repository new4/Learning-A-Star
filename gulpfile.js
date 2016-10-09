var gulp = require( "gulp");
var ts = require( "gulp-typescript");
var sass = require( "gulp-sass" );
var browserify = require( "browserify" );
var source = require( "vinyl-source-stream" );
var tsify = require( "tsify" );
var rename = require( "gulp-rename" );

var paths = {
  "html": {
    "src": [ "src/*.html" ],
    "dist": "example"
  },
  "ts": {
    "src": [ "src/ts/*.ts" ],
    "entry": [ "src/ts/main.ts" ],
    "dist": "dist"
  },
  "scss": {
    "src": [ "src/scss/*.scss" ],
    "entry": [ "src/scss/main.scss" ],
    "dist": "example/css"
  }
}

gulp.task( "tsHandler", function(){
    browserify({
        basedir: '.',
        debug: true,
        entries: paths.ts.entry,
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest( paths.ts.dist ));
});

gulp.task( 'htmlHandler', function(){
  gulp.src( paths.html.src )
      .pipe( gulp.dest( paths.html.dist ) );
});

gulp.task( 'sassHandler', function(){
  gulp.src( paths.scss.entry )
      .pipe( sass().on( 'error', sass.logError ) )
      .pipe( rename( "style.css" ) )
      .pipe( gulp.dest( paths.scss.dist ) )
});

gulp.task( 'default', [ 'tsHandler', 'htmlHandler', 'sassHandler' ] );

gulp.watch( [].concat( paths.html.src, paths.ts.src, paths.scss.src ), [ 'default' ] );
