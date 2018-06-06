module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        clean: ['dist'],

        copy: {
            dist_js: {
                expand: true,
                cwd: 'src',
                src: ['**/*.ts', '**/*.d.ts', '**/*.js'],
                dest: 'dist'
            },
            dist_html: {
                expand: true,
                flatten: true,
                cwd: 'src/partials',
                src: ['*.html'],
                dest: 'dist/partials/'
            },
            dist_css: {
                expand: true,
                flatten: true,
                cwd: 'src/css',
                src: ['*.css'],
                dest: 'dist/css/'
            },
            dist_img: {
                expand: true,
                flatten: true,
                cwd: 'src/img',
                src: ['*.*'],
                dest: 'dist/img/'
            },
            dist_statics: {
                expand: true,
                flatten: true,
                src: ['src/plugin.json', 'LICENSE', 'README.md'],
                dest: 'dist/'
            }
        },

        ts: {
            default: {
                src: ['dist/**/*.ts', '!**/*.d.ts'],
                outDir: "dist"
            }
        },
        watch: {
            files: ['src/**/*.ts', 'src/**/*.html', 'src/**/*.css', 'src/img/*.*', 'src/plugin.json', 'README.md'],
            tasks: ['default'],
            options: {
                debounceDelay: 250,
            },
        }
    });

    grunt.registerTask('default', [
        'clean',
        'copy:dist_js',
        'ts',
        'copy:dist_html',
        'copy:dist_css',
        'copy:dist_img',
        'copy:dist_statics'
    ]);
};