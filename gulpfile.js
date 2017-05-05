var gulp = require('gulp');
var clean = require('gulp-clean');
var exec = require('gulp-exec');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function() {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

gulp.task('database', function() {
    /*exec('mongod --dbpath ./data', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });*/
});

gulp.task('build', function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('server', function(cb) {
    nodemon({
        script: 'dist/server.js',
        ext: '',
        ignore: ['gulpfile.js'],
        env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('default', ['build', 'server']);