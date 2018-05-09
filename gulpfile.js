var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine-phantom');


// DEFAULT gulp behavior
gulp.task('default', ['copy-imgs', 'copy-html', 'styles', 'scripts'], function() {
    // watch changes scss
    gulp.watch('sass/**/*.scss', ['styles', 'reload-browser']);
    gulp.watch('*.html', ['copy-html', 'reload-browser']);
    gulp.watch('img/**/*', ['copy-imgs', 'reload-browser']);
    gulp.watch('js/**/*.js', ['scripts', 'reload-browser']);


    // serve with browserSync
    browserSync.init({
        server: "./dist"
    });
});

// this task reloads the browser
gulp.task('reload-browser', function() {
        //resync browser
        browserSync.reload();
});

// gulp STYLE files into dist folder and resync browser
gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        // convert sass
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        // add prefixes
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        // save css
        .pipe(gulp.dest('dist/css'));
});

// copy HTML to dist
gulp.task('copy-html', function() {
    gulp.src('*.html')
        // copy to dist
        .pipe(gulp.dest('dist'));
});

// copy IMAGES to dist
gulp.task('copy-imgs', function() {
    gulp.src('img/**/*')
        // optimize image sizes
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        // copy to dist
        .pipe(gulp.dest('dist/img'));
});

// concatenate JS files
gulp.task('scripts', function(){
    gulp.src('js/**/*.js')
        // transpile es6
        .pipe(babel({
            presets: ['env']
        }))
        // concat all js files to app.js
        .pipe(concat('app.js'))
        // copy to dist
        .pipe(gulp.dest('dist/js'));
});

// concatenate JS DIST files
gulp.task('scripts-dist', function(){
    gulp.src('js/**/*.js')
        // start source map
        .pipe(sourcemaps.init())
        // transpile es6
        .pipe(babel({
            presets: ['env']
        }))
        // concat all js files to app.js
        .pipe(concat('app.js'))
        // minify with uglify
        .pipe(uglify())
        // write source maps
        .pipe(sourcemaps.write())
        // copy to dist
        .pipe(gulp.dest('dist/js'));
});

// DIST TASK
gulp.task('dist', [
    'copy-html',
    'copy-imgs',
    'styles',
    'scripts-dist']
);

// task for future tests
gulp.task('tests', function() {
    gulp.src('gulpTesting.js')
    .pipe(jasmine({
        // integration false for testing nodeJS code
        integration: true,
        // vendor should point to javascript source files
        vendor: 'js/**/*.js'
    }));
});