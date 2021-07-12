const { src, dest, watch, parallel, series } = require('gulp')

const concat        = require('gulp-concat')
const scss          = require('gulp-sass')(require('sass'))
const browserSync   = require('browser-sync').create()
const autoprefixer  = require('gulp-autoprefixer')
const cleancss      = require('gulp-clean-css')
const fileinclude   = require('gulp-file-include')
const notify        = require('gulp-notify')
const del           = require('del')



function html() {
	return src(['src/*.html', '!src/**/_*.html'])
	.pipe(fileinclude({
		prefix: '@@',
		basepath: 'src/includes'
	}))
	.pipe(dest('dist'))
	.pipe(browserSync.stream())
}

function styles() {
	return src('src/scss/style.scss')
	.pipe(scss().on("error", notify.onError()))
	.pipe(concat('style.css'))
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 10 version'],
		grid: true
	}))
	.pipe(cleancss({
		level:{1: {specialComments:0}},
		format: 'beautify'
	}))
	.pipe(dest('dist/css'))
	.pipe(browserSync.stream())
}

function images() {
	return src('src/images/**/*')
	.pipe(dest('dist/images'))
	.pipe(browserSync.stream())
}

function fonts() {
	return src('src/fonts/**/*')
	.pipe(dest('dist/fonts/'))
	.pipe(browserSync.stream())
}

function clean() {
	return del('dist/**/*')
}

function startwatch() {
	browserSync.init({
		server: {
			baseDir: './dist'
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
	});
	watch('src/**/*.html', html)
	watch('src/scss/**/*.scss', styles)
	watch('src/images/**/*.{jpg,jpeg,png,webp,svg,gif}', images)
	watch('src/fonts/**/*', fonts)
}



exports.html    = html
exports.styles  = styles
exports.images  = images
exports.clean   = clean;

exports.build   = series(clean, html,  styles, images, fonts)
exports.default = series(html, styles, images, fonts, parallel(startwatch))