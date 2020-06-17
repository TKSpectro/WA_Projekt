/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    paths: [
                        'src/less'
                    ],
                    compress: true,
                    plugins: [
                        new (require('less-plugin-autoprefix'))({
                            browsers: [
                                'last 2 versions',
                                'ie 9'
                            ]
                        })
                    ],
                    banner:
                        '/*!\n' +
                        ' * Created By Bilal Alnaani, Tom Käppler\n' +
                        ' * @version 1.0.0\n' +
                        ' */\n',
                },
                files: {
                    'assets/css/layout.css': 'src/less/layout.less',
                    'assets/css/index.css': 'src/less/index.less',
                    'assets/css/signin.css': 'src/less/signin.less'
                }
            }
        },
        uglify: {
            build: {
                files: {
                    'assets/js/index.min.js' : 'src/js/index.js',
                    'assets/js/signin.min.js' : 'src/js/signin.js'
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'src/less/**',
                    'src/js/**'
                ],
                tasks: ['less', 'uglify'],
            }
        },
        apidoc: {
            taskboard: {
                src: "/controllers/api/",
                dest: "/src/apidoc/"
            }
        }
    });

    
    //load plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-apidoc');

    //register plugins
    grunt.registerTask('build', ['less', 'uglify']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('apidoc', ['apidoc']);
}