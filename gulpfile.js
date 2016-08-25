var elixir = require('laravel-elixir'),
    liveReload = require('gulp-livereload'),
    clean = require('rimraf'),
    gulp = require('gulp');


var config = {
    assets_path: './resources/assets',
    build_path: './public/build',
    node_path: './node_modules'
};

config.bower_path = config.assets_path + '/../bower_components';
config.build_path_js = config.build_path + '/js';
config.build_vendor_path_js = config.build_path_js + '/vendor';

config.vendor_path_js = [
    config.node_path + '/bootstrap-material-design/bower_components/jquery/dist/jquery.min.js',
    config.node_path + '/bootstrap-material-design/bower_components/bootstrap/dist/js/bootstrap.min.js',
    config.node_path + '/bootstrap-material-design/dist/js/ripples.min.js',
    config.node_path + '/bootstrap-material-design/dist/js/material.min.js',
    config.bower_path + '/jquery-treegrid/js/jquery.cookie.js',
    config.bower_path + '/jquery-treegrid/js/jquery.treegrid.min.js',
    config.bower_path + '/jquery-treegrid/js/jquery.treegrid.bootstrap3.js'

];

config.build_path_css = config.build_path + '/css';
config.build_vendor_path_css = config.build_path_css + '/vendor';

config.vendor_path_css = [
    config.node_path + '/bootstrap-material-design/bower_components/bootstrap/dist/css/bootstrap.min.css',
    config.node_path + '/bootstrap-material-design/dist/css/ripples.min.css',
    config.node_path + '/bootstrap-material-design/dist/css/bootstrap-material-design.min.css',
    config.bower_path + '/components-font-awesome/css/font-awesome.min.css',
    config.bower_path + '/jquery-treegrid/css/jquery.treegrid.css'

];

config.build_path_html = config.build_path + '/views';
config.build_path_fonts = config.build_path + '/fonts';
config.build_path_images = config.build_path + '/images';


gulp.task('copy-fonts', function() {
    gulp.src(config.bower_path + '/components-font-awesome/fonts/**/*')
        .pipe(gulp.dest(config.build_path_fonts));
});

gulp.task('copy-images', function () {
    gulp.src([
        config.assets_path + '/images/**/*'
    ])
        .pipe(gulp.dest(config.build_path_images))
        .pipe(liveReload());
});

gulp.task('copy-styles', function () {
    gulp.src([
        config.assets_path + '/css/**/*.css'
    ])
        .pipe(gulp.dest(config.build_path_css))
        .pipe(liveReload());

    gulp.src(config.vendor_path_css)
        .pipe(gulp.dest(config.build_vendor_path_css))
        .pipe(liveReload());
});

gulp.task('copy-scripts', function () {
    gulp.src([
        config.assets_path + '/js/**/*.js'
    ])
        .pipe(gulp.dest(config.build_path_js))
        .pipe(liveReload());

    gulp.src(config.vendor_path_js)
        .pipe(gulp.dest(config.build_vendor_path_js))
        .pipe(liveReload());
});

gulp.task('clear-build-folder', function () {
    clean.sync(config.build_path);
});

gulp.task('default',['clear-build-folder'], function(){
    gulp.start('copy-fonts');
    elixir(function(mix) {
        mix.styles(config.vendor_path_css.concat([config.assets_path + '/css/**/*.css']), 'public/css/all.css', config.assets_path);
        mix.scripts(config.vendor_path_js.concat([config.assets_path + '/js/**/app.js']), 'public/js/all.js', config.assets_path);
        mix.version(['js/all.js', 'css/all.css']);
    });

});

gulp.task('watch-dev', ['clear-build-folder'], function () {
    liveReload.listen();
    gulp.start('copy-styles', 'copy-scripts');
    gulp.watch(config.assets_path + '/**', [
        'copy-styles', 'copy-scripts'
    ]);
});

