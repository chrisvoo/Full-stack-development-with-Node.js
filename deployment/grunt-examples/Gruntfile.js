module.exports = function(grunt) {
  grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),  
    less: {
      main: {
        options: {
          paths: ["my_css"]
        },
        files: {
          "tmp/serve/main.css": "my_css/main.less"
        }
      }
    },
    browserify: {
      client: {
        src: ["my_javascripts/main.js"],
        dest: "tmp/serve/main.js"
      }
    },
    uglify: {
	  options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      myClient: {
        files: {
          "tmp/serve/main.min.js": ["tmp/serve/main.js"]
        }
      }
    },
    /* task that watches your files and reruns any Grunt tasks
     * when a change occurs. */
    watch: {													
      scripts: {
        files: ["**/*.js"],
        tasks: ["browserify"]
      },
      styles: {
        files: ["**/*.less"],
        tasks: ["less"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["browserify", "less", "uglify"]);
};
