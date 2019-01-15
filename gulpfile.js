var gulp = require('gulp')
// 网页自动刷新（服务器控制客户端同步刷新）
var livereload = require('gulp-livereload')
// 本地服务器
var webserver = require('gulp-webserver')
// sass文件编译成css,依赖于node-sass库
var sass = require('gulp-sass')
// 压缩css文件
var cssmin = require('gulp-clean-css')
// 生成sourcemap文件
var sourcemaps = require('gulp-sourcemaps')
// 当发生异常时提示错误
var notify = require('gulp-notify')
var plumber = require('gulp-plumber')
// 压缩html，可以压缩页面javascript、css，去除页面空格、注释，删除多余属性等操作
var htmlmin = require('gulp-htmlmin')
// 只操作有过修改的文件
var changed = require('gulp-changed')
// 压缩图片文件（包括PNG、JPEG、GIF和SVG图片）
var imagemin = require('gulp-imagemin')
// 深度压缩图片
var pngquant = require('imagemin-pngquant')
// 只压缩修改的图片，没有修改的图片直接从缓存文件读取（C:\Users\Administrator\AppData\Local\Temp\gulp-cache）。
var cache = require('gulp-cache')
// 给css文件里引用url加版本号
var cssver = require('gulp-make-css-url-version')
// 文件重命名
var rename = require('gulp-rename')
// 文件清理
var clean = require('gulp-clean')

// 压缩js文件
var uglify = require('gulp-uglify')

// gulp-babel版本不可过高，切记切记
var babel = require('gulp-babel');

/**
 * 使用gulp-sass文件编译成css
 */
gulp.task('sassTask', function () {
    gulp.src('src/sass/index.scss')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) // 错误提示
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        // .pipe(rename({ suffix: '.index' })) // 重命名
        .pipe(sass()) // 将sass文件编译成css
        .pipe(cssmin()) // 压缩css
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css')) // 将会在dist/css下生成index.css
})

/**
 * 使用gulp-htmlmin压缩html
 */
gulp.task('htmlminTask', function () {
    var options = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
    };
    var stream = gulp.src('index.html')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) // 错误提示
        .pipe(changed('dist'))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'))
    return stream

})

/**
 * 使用gulp-cache只压缩修改的图片
 */
gulp.task('cacheTask', function () {
        gulp.src('images/*.{png,jpg,gif,ico}')
            .pipe(plumber({
                errorHandler: notify.onError('Error: <%= error.message %>')
            })) // 错误提示
            .pipe(changed('dist/images'))
            .pipe(cache(imagemin({
                progressive: true,
                svgoPlugins: [{
                    removeViewBox: false
                }],
                use: [pngquant()]
            })))
            .pipe(gulp.dest('dist/images'));
    })


    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
    })) // 错误提示
    .pipe(changed('dist/js')) // 对应匹配的文件
    .pipe(sourcemaps.init()) // 执行sourcemaps
    .pipe(rename({
        suffix: '.min'
    })) // 重命名
    .pipe(uglify()) // 使用uglify进行压缩，并保留部分注释
    .pipe(sourcemaps.write('./')) // 地图输出路径（存放位置）
    .pipe(gulp.dest('dist/js'));

// 压缩js文件

gulp.task('script', function () {
    // 1. 找到文件
    gulp.src('src/index.js')
        // 2.es6语法编译 压缩文件
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) // 错误提示
        .pipe(changed('dist/')) // 对应匹配的文件
        .pipe(sourcemaps.init()) // 执行sourcemaps
        .pipe(babel())
        .pipe(uglify()) // 使用uglify进行压缩，并保留部分注释
        .pipe(sourcemaps.write('./')) // 地图输出路径（存放位置）
        .pipe(gulp.dest('dist/'))
})




/**
 * 清理文件
 */
gulp.task('cleanTask', function () {
    var stream = gulp.src('dist', {
            read: false
        }) // 清理maps文件
        .pipe(clean())
    return stream
})

/**
 * 注册任务
 */
gulp.task('webserver', ['htmlminTask'], function () {
    gulp.src('dist') // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: 'index.html', // 服务器启动时自动打开网页
            port: 8082 // 服务端口
        }))
})

/**
 * 监听任务
 */
gulp.task('watch', function () {
    // 监听 sass
    gulp.watch('src/sass/*.scss', ['sassTask'])
    // 监听 html
    gulp.watch('index.html', ['htmlminTask'])


})

/**
 * 默认任务
 */
gulp.task('default', ['htmlminTask', 'script', 'cacheTask', 'sassTask', 'webserver', 'watch'])