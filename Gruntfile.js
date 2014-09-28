module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig({
		bwr: grunt.file.readJSON('bower.json'),

		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['tests/**/*.js']
			}
		}
	});


	grunt.registerTask('test', ['mochaTest']);
};
