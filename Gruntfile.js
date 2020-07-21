/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

module.exports = function(grunt) {
    grunt.initConfig({
        // Reference to all Plugun, that we have
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    paths: [
                        'src/less'
                    ],
                    compress: true,
                    plugins: [
                        new(require('less-plugin-autoprefix'))({
                            browsers: [
                                'last 2 versions',
                                'ie 9'
                            ]
                        })
                    ],
                    banner: '/*!\n' +
                        ' * Created By Bilal Alnaani, Tom Käppler\n' +
                        ' * @version 1.0.0\n' +
                        ' */\n',
                },
                files: {
                    'assets/css/layout.css': 'src/less/layout.less',
                    'assets/css/index.css': 'src/less/index.less',
                    'assets/css/signin.css': 'src/less/signin.less',
                    'assets/css/project.css': 'src/less/project.less',
                }
            }
        },
        uglify: {
            build: {
                files: {
                    'assets/js/taskForm.min.js': 'src/js/taskForm.js',
                    'assets/js/index.min.js': 'src/js/index.js',
                    'assets/js/signin.min.js': 'src/js/signin.js',
                    'assets/js/project.min.js': 'src/js/project.js',
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'src/less/**',
                    'src/js/**',
                    'src/apidoc/**'
                ],
                tasks: ['less', 'uglify', 'copy', 'apidoc'],
            }
        },
        apidoc: {
            taskboard: {
                src: "src/apidoc/",
                dest: "docs/"
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    { src: 'node_modules/html5sortable/dist/html5sortable.min.js', dest: 'assets/js/html5sortable.min.js' },
                ],
            },
        },
    });



    //load plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-apidoc');
    grunt.loadNpmTasks('grunt-contrib-copy');

    //register plugins
    grunt.registerTask('build', ['less', 'uglify', 'copy', 'apidoc']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('apiDoc', ['apidoc']);
}