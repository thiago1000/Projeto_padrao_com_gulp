const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const imageMin = require('gulp-imagemin');
const pngQuint = require('imagemin-pngquant'); 
const jpgRecompress = require('imagemin-jpeg-recompress'); 
const autoprefixer  = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

// npm install -D gulp browser-sync gulp-sass gulp-clean-css gulp-rename gulp-imagemin imagemin-pngquant imagemin-jpeg-recompress gulp-autoprefixer gulp-sourcemaps


// Compile sass into CSS & auto-inject into browsers
function scss(){
    return gulp.src(['src/scss/Bootstrap4/bootstrap.scss','src/scss/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
}

// Move the javascript files into our /src/js folder
function js(){
    return gulp.src(['src/js/*.js'])
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
}

function css(){
    return gulp.src('src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
}

function fonts(){
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
}

function img(){
    return gulp.src(['src/img/**/*.+(png|jpg|gif|svg)','src/img/*.+(png|jpg|gif|svg)'])
        .pipe(imageMin([
            imageMin.gifsicle(),
            imageMin.optipng(),
            imageMin.svgo(),
            pngQuint(),
            jpgRecompress()
        ]))
        .pipe(gulp.dest('dist/img'));
}

// Static Server + watching scss/html files

function server(){
    browserSync.init({
        server: "./dist"  
    });

    gulp.watch('./src/scss/**/*.scss', scss)
    gulp.watch('./src/js/*.js', js)
    gulp.watch('./src/css/*.css', css)
    gulp.watch('./src/img/**/*', img)

    gulp.watch(["dist/*.html",".dist/**/*"]).on('change', browserSync.reload);

}

// gulp.task('default', gulp.parallel('js', 'css', 'fonts', 'img', 'serve' ));

exports.default = gulp.parallel(scss,js,css,fonts,img );
exports.server = server;