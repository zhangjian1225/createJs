var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass'); 
//sass
gulp.task('scss', function(){
	return gulp.src('./src/css/style.scss')
	.pipe(sass())
	.pipe(gulp.dest('./src/css'))
	.pipe(browserSync.reload({stream:true}));
})
//brower
gulp.task('browser-sync', ['scss'], function(){
	browserSync({
		files: ['**'],
		server: {
			baseDir: './',// 设置服务器的根目录
			directory: true,
			index: 'index.html'// 指定默认打开的文件
		},
		open: 'external',//ip号
		port:8080 //端口号
	})
	gulp.watch("./src/css/style.scss", ['scss']);
	gulp.watch("./index.html").on('change', browserSync.reload);
})

gulp.task('default', ['browser-sync'])
