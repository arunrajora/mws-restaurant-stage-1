module.exports = function(grunt) {
      grunt.initConfig({
        responsive_images: {
            dev: {
                options: {
                  newFilesOnly: true,
                  rename: false,
                  engine: 'im',
                  sizes: [
                    { 
                      name: '270px wide',
                      suffix: '-270w',
                      width: 270
                    },
                    { 
                      name: '640px wide',
                      suffix: '-640w',
                      width: 640
                    },
                    {
                      name: '800px wide',
                      suffix: '-800w',
                      width: 800
                    }
                  ]
                },
                files: [{
                    expand: true,
                    src: ['*.{gif,jpg,png}'],
                    cwd: 'src_img/',
                    dest: 'img/'
        }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.registerTask('default', ['responsive_images']);
}