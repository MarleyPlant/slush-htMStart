/*
 * slush-htmstart
 * https://github.com/MarleyPlant/slush-htmstart
 *
 * Copyright (c) 2017, Marley Joseph Plant
 * Licensed under the MIT license.
 */


'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    clear = require('clear'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    download = require('gulp-download'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path')



function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }
    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.authorName
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    }, {
        name: 'frameworks',
        message: 'Allrighty so now your gonna need some frameworks, what you after?',
        type: 'checkbox',
        choices: [{
                    name: 'Bootstrap',
                    value: 'includeBootstrap',
                    checked: true
                  }, {
                    name: 'Font-Awesome',
                    value: 'includeFontAwesome',
                    checked: true
                  }, {
                    name: 'JQuery',
                    value: 'includeJQuery',
                    checked: true
                  }, {
                    name: 'MDBootstrap',
                    value: 'includeMDBootstrap',
                    checked: false
                  }, {
                    name: 'FlatUI',
                    value: 'includeFlatUI',
                    checked: false
                  }]
    }, {
        name: 'htmlinserts',
        message: 'What Should I Add To Your Code for you?',
        type: 'checkbox',
        choices: [{
                    name: 'Navbar',
                    value: 'navbar',
                    checked: false
                  }]
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Finish Install?'
    }];
    //Ask
    clear();
    console.log(" \n\
                    )            *     (                           \n\
                  ( /(   *   )  (  `    )\ )    )               )  \n\
                  )\())` )  /(  )\))(  (()/( ( /(    )  (    ( /(  \n\
                  ((_)\  ( )(_))((_)()\  /(_)))\())( /(  )(   )\())\n\
                  _((_)(_(_()) (_()((_)(_)) (_))/ )(_))(()\ (_))/  \n\
                  | || ||_   _| |  \/  |/ __|| |_ ((_)_  ((_)| |_  \n\
                  | __ |  | |   | |\/| |\__ \|  _|/ _` || '_||  _| \n\
                  |_||_|  |_|   |_|  |_||___/ \__|\__,_||_|   \__| \n\
                                                                   \n\
                      A Slush Based HTML5 Template Generator     \n\
                ")
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }

            answers.appNameSlug = _.slugify(answers.appName);
            if(answers.frameworks.includes('includeFontAwesome')){
              download('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css') //MDB CSS
                .pipe(gulp.dest("./dist/css/"));
            }

            if(answers.frameworks.includes('includeFlatUI')){
                //Download Flat-UI
                download('https://designmodo.github.io/Flat-UI/dist/css/flat-ui.css') //FlatUI CSS
                  .pipe(gulp.dest("./dist/css/"));
            }

            gulp.src(__dirname + '/templates/**')
                .pipe(template(answers))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
