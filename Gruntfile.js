/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            // this is the "dev" Sass config used with "grunt watch" command
            dev: {
                options: {
                    style: 'expanded',
                    // tell Sass to look in the Bootstrap stylesheets directory when compiling
                    loadPath: 'node_modules/bootstrap-sass/assets/stylesheets'
                },
                files: {
                    // the first path is the output and the second is the input
                    'dist/css/mystyle.css': 'sass/wott.scss'
                }
            },
            // this is the "production" Sass config used with the "grunt buildcss" command
            dist: {
                options: {
                    style: 'compressed',
                    loadPath: 'node_modules/bootstrap-sass/assets/stylesheets'
                },
                files: {
                    'dist/css/wott.css': 'sass/wott.scss'
                }
            }
        },
        // configure the "grunt watch" task
        watch: {
            sass: {
                files: 'sass/*.scss',
                tasks: ['sass:dev']
            }
        },
        concat: {
            options: {
              separator: ';'
            },
            dist: {
              src: ['js/*.js'],
              dest: 'dist/js/wott.js'
            }
        },
        htmlmin: {
            dist: {
              options: {
                removeComments: true,
                collapseWhitespace: true
              },
              files: {
                'dist/index.html': 'public_html/index.html'
              }
            },
            dev: {
              files: {
                'dist/index.html': 'public_html/index.html',
              }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: true, src: ['data/**'], dest: 'dist/', isFile: true},
                    
                    {expand: false, src: ['public_html/server.php'], dest: 'dist/server.php', isFile: true}
                  ],
            },
        },
        handlebars: {
            all: {
                files: {
                    "js/templates.js": ["templates/*.hbs"]
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    
    grunt.registerTask('build',['sass:dist','handlebars','concat','htmlmin','copy']);
    grunt.registerTask('default',['build']);
};
