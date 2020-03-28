'use strict';

const   gulp       	 = require('gulp'),
        browserSync	 = require('browser-sync').create(),
        sass       	 = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        stripCssComments = require('gulp-strip-css-comments'),
        rename = require('gulp-rename'),
        cleanCss = require('gulp-clean-css'),
        rigger = require('gulp-rigger'),
        uglify = require('gulp-uglify-es').default,
        imagemin = require('gulp-imagemin'),
        imgCompress = require('imagemin-jpeg-recompress'),
        clean = require('gulp-clean');

gulp.task('clean', function() {
    return gulp.src('dist', {allowEmpty : true})
        .pipe(clean());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {

    gulp.src('dist/css', {allowEmpty : true}).pipe(clean());

    return gulp.src("src/scss/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest("dist/css")) //usual css make end
});

// Minify css to min.css
gulp.task('clean-css', gulp.series('sass', function() {
    return gulp.src("dist/css/*.css") // беру отсюда
        .pipe(cleanCss()) //объединить файлы в один
        .pipe(stripCssComments({
            preserve: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("dist/css")) // копирую сюда
        .pipe(browserSync.stream());
}))

gulp.task('html', function() {

    gulp.src('dist/**/*.html', {allowEmpty : true}).pipe(clean());

    return gulp.src('src/*.html') //take form this
        .pipe(rigger())
        .pipe(gulp.dest("dist/")) //save to this
        .pipe(browserSync.stream()); //update
});

gulp.task('fonts', function() {

    gulp.src('dist/fonts', {allowEmpty : true}).pipe(clean());

    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.stream());
});

gulp.task('favicon', function() {
    return gulp.src('src/favicon.*')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('images', function () {

    gulp.src('dist/img',{allowEmpty : true}).pipe(clean());

    return gulp.src('src/img/*') //сжимаем картинки
        .pipe(imagemin([
            imgCompress({
                loops: 4,
                min: 70,
                max: 80,
                quality: 'high'
            }),
            imagemin.gifsicle(),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {

    gulp.src('dist/js', {allowEmpty : true}).pipe(clean());

    return gulp.src('src/js/main.js')
    .pipe(rigger())
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename({
            suffix: '.min'
        }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});


// Static Server + watching scss/html files
gulp.task('serve', gulp.series('clean-css', 'js', 'html', 'images', 'favicon', 'fonts', function() {

    browserSync.init({
        server: "./dist/"
    });

    gulp.watch("src/scss/*.scss", gulp.parallel('clean-css'));
    gulp.watch("src/**/*.html", gulp.parallel('html'));
    gulp.watch("src/js/**/*.js", gulp.parallel('js'));
    gulp.watch("src/img/**/*.*", gulp.parallel('images'));
    gulp.watch("src/fonts/**/*.*", gulp.parallel('fonts'));
}));


gulp.task('default', gulp.series('serve'));
