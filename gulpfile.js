/**
 * Created by Alexander on 30.11.2014.
 */
var gulp = require('gulp');
var unzip = require('gulp-unzip');
var download = require("gulp-download");
var clean = require('gulp-clean');
var path = require('path');
var insert = require('gulp-insert');
var gulpSlash = require('gulp-slash');

var downloadDir = './downloads/';
var installDir = './roboCode/';

var configDir = installDir + 'config';
var configSoruce = './config/robocode.properties';

var roboCodeVersion = '1.9.2.4';

var roboCodeSources = 'robocode-' + roboCodeVersion + '-src.zip';
var roboCodeMainSetup = 'robocode-' + roboCodeVersion + '-setup.jar';
var roboCodeDotNetSetup = 'robocode.dotnet-' + roboCodeVersion + '-setup.jar';

var setupFiles = ['http://downloads.sourceforge.net/project/robocode/robocode%20sources/' + roboCodeVersion + '/' + roboCodeSources,
                  'http://downloads.sourceforge.net/project/robocode/robocode/' + roboCodeVersion + '/' + roboCodeMainSetup ,
                  'http://downloads.sourceforge.net/project/robocode/robocode/' + roboCodeVersion + '/' + roboCodeDotNetSetup];



var dotNetBotDirectory = path.join(process.cwd(), "./DotNetBot/bin/Debug");

gulp.task('preload', ['clean'], function() {
    return  download(setupFiles).pipe(gulp.dest(downloadDir));
});

gulp.task('clean', ['clean-dl','clean-install']);

gulp.task('clean-dl', function() {
    return  gulp.src(downloadDir, {read: false}).pipe(clean());
});


gulp.task('clean-install', function() {
    return gulp.src(installDir, {read: false}).pipe(clean());
});


gulp.task('unpack',['preload','unpack-main', 'unpack-dotnet']);


gulp.task('unpack-main', ['preload'],function() {

    return gulp.src(downloadDir + roboCodeMainSetup)
        .pipe(unzip())
        .pipe(gulp.dest(installDir));

});

gulp.task('unpack-dotnet',['preload','unpack-main'],function() {

    return gulp.src(downloadDir + roboCodeDotNetSetup)
        .pipe(unzip())
        .pipe(gulp.dest(installDir));

});

gulp.task('config-unix',['unpack','clean'],function() {

    return gulp.src(configSoruce)
        .pipe(insert.append('robocode.options.development.path=' + gulpSlash(dotNetBotDirectory)))
        .pipe(gulp.dest(configDir));

});

function winPath (s ) {
    s = s.toString().replace(new RegExp('/', 'g'), '\\\\');
    s = s.toString().replace(new RegExp(':', 'g'),'\\:');
    return s;
}

gulp.task('config-win',['unpack','clean'],function() {

    return gulp.src(configSoruce)
        .pipe(insert.append('robocode.options.development.path=' + winPath(gulpSlash(dotNetBotDirectory))))
        .pipe(gulp.dest(configDir));

});


gulp.task('install',['unpack','clean'] );

gulp.task('install-win',['install','config-win'] );
gulp.task('install-unix',['install','config-unix'] );


gulp.task('default',['install-win'] );


