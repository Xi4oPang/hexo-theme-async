const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// 路径配置
const paths = {
    less: {
        src: 'source/css/**/*.less',
        dest: 'source/css'
    },
    watch: [
        'source/css/**/*.less',
        'layout/**/*.ejs',
        'source/js/**/*.js'
    ]
};

// 编译 Less 文件
function buildLess() {
    return gulp.src('source/css/index.less')
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: ['source/css', 'source/css/_components', 'source/css/_variables']
        }))
        .on('error', function(err) {
            console.log('Less 编译错误:', err.message);
            this.emit('end');
        })
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8',
            level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(rename('index.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('source/css'))
        .pipe(browserSync.stream());
}

// 清理构建文件
function clean() {
    const del = require('del');
    return del(['source/css/*.min.css', 'source/css/*.map']);
}

// 监听文件变化
function watch() {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'test.html'
        },
        port: 3000,
        open: false
    });

    gulp.watch(paths.less.src, buildLess);
    gulp.watch(paths.watch).on('change', browserSync.reload);
}

// 导出任务
exports.build = buildLess;
exports.watch = watch;
exports.clean = clean;
exports.default = buildLess;





