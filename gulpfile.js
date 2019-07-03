var gulp = require('gulp');
var sass = require('gulp-sass');
var slm = require('gulp-slm');
var notify = require('gulp-notify');

var browserSync = require('browser-sync').create();


gulp.task('default', [
	'browser-sync',
	'html-watch-reload',
	'sass-watch',
	'sass-compile-reload',
	'slm-watch',
	'slm-to-html'
]);


gulp.task('browser-sync', function() {
	browserSync.init({
		startPath: 'index.html',
		server: {
			baseDir: './',
		}
	});
});

gulp.task('html-watch-reload', function() {
	gulp.watch('./*.html').on('change', function() {
		console.log(new Date(), 'HTML was changed');
		browserSync.reload();
	});
});

gulp.task('sass-watch', function () {
	gulp.watch('./style.sass', ['sass-compile-reload']);
});

gulp.task('sass-compile-reload', function () {
	console.log(new Date(), 'Recompile styles...')
	gulp.src('./*.sass')
		.pipe(sass({outputStyle: 'compressed'}).on('error', notify.onError(function (error) {
			return error.message;
		})))
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream());
});

gulp.task('slm-watch', function() {
	gulp.watch('./*.slm', ['slm-to-html']);
});

gulp.task('slm-to-html', function() {
	console.log(new Date, 'Recompile slm template...');
	return gulp.src('./*.slm')
		.pipe(slm({useCache: false}).on('error', notify.onError(function (error) {
			var message = 'Slm template error\n' + error.message;
			if (error.message.indexOf('Line') == -1 && error.message.indexOf('Column') == -1) {
				var errorPosition = error.stack.match(/:(\d+):(\d+)/);
				message += `\nAt line ${errorPosition[1]}, column ${errorPosition[2]}`;
			}
			return message;
		})))
		.pipe(gulp.dest('./'));
});