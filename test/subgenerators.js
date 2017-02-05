'use strict';
var util = require('./test-utility');
var path = require('path');

/*
 * Test for all subgenerators NOT requiring a name argument
 */
describe('Subgenerators without arguments tests', function() {

  describe('aspnet:program', function() {
    util.goCreate('program');
    util.fileCheck('should create Program.cs file', 'Program.cs');
  });

  describe('aspnet:appsettings', function() {
    util.goCreate('appsettings');
    util.fileCheck('should create appsettings json file', 'appsettings.json');
  });

  describe('aspnet:startup', function() {
    util.goCreate('startup');
    util.fileCheck('should create startup.cs file', 'Startup.cs');
  });

  describe.skip('aspnet:startup in cwd of project.json', function() {
    var dir = util.makeTempDir();

    util.goCreateApplication('classlib', 'emptyTest', dir);

    util.goCreate('startup', path.join(dir, 'emptyTest'));
    util.fileCheck('should create Startup.cs file', 'Startup.cs');
    util.fileContentCheck('Startup.cs', 'file content check', /^namespace emptyTest$/m);
  });

  describe('aspnet:gitignore', function() {
    util.goCreate('gitignore');
    util.fileCheck('should create .gitignore file', '.gitignore');
  });

  describe('aspnet:dockerfile has the same .NET version', function() {
    var sdkVersion = '1.1.0';
    var arg = 'file';
    var dir = util.makeTempDir();

    util.goCreateApplication('mvc', 'webTest', dir);
    util.goCreateWithArgs('mvccontroller', [arg], path.join(dir, 'webTest'));

    util.fileContentCheck('project.json', 'file content check', new RegExp('"Microsoft.NETCore.App":\\s*{\\s*"version": "' + sdkVersion + '"'));
    util.fileContentCheck('Dockerfile', 'Check the content for dotnet latest image tag', new RegExp('FROM microsoft\/dotnet:' + sdkVersion + '-sdk-projectjson\\b'));
    util.fileContentCheck('Dockerfile.nano', 'Check the content for dotnet nanoserver latest image tag', new RegExp('FROM microsoft\/dotnet:' + sdkVersion + '-sdk-projectjson-nanoserver\\b'));
  });

  /**
   * Dockerfile can be created with two versions:
   * - without SQLite installed
   * - with SQLite installed and EF migrations called
   */
  describe('aspnet:dockerfile dotnet', function() {
    var filename = 'Dockerfile';
    util.goCreate(filename.toLowerCase());
    util.fileCheck('should create Dockerfile', filename);
    util.fileContentCheck(filename, 'Check the content for dotnet latest image tag', /FROM microsoft\/dotnet:/);
    util.noFileContentCheck(filename, 'Does not contain SQLite install', /RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev/);
    util.noFileContentCheck(filename, 'Does not call database migrations', /RUN \["dotnet", "ef", "database", "update"\]/);
  });

  describe('aspnet:dockerfile dotnet with --sqlite', function() {
    var arg = '--sqlite';
    var filename = 'Dockerfile';
    util.goCreateWithArgs(filename.toLowerCase(), [arg]);
    util.fileCheck('should create Dockerfile', filename);
    util.fileContentCheck(filename, 'Check the content for dotnet latest image tag', /FROM microsoft\/dotnet:/);
    util.fileContentCheck(filename, 'Contains SQLite install', /RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev/);
    util.fileContentCheck(filename, 'Calls database migrations', /RUN \["dotnet", "ef", "database", "update"\]/);
  });

  describe('aspnet:nugetconfig', function() {
    util.goCreate('nugetconfig');
    var filename = 'nuget.config';
    util.fileCheck('should create NuGet configuration file', filename);
  });

  describe('aspnet:readme creates README.md', function() {
    util.goCreate('readme');
    var filename = 'README.md';
    util.fileCheck('should create README.md documentation file', filename);
    util.fileContentCheck(filename, 'Check file content', /^# MyNamespace$/m);
  });

  describe('aspnet:readme with --txt option creates README.txt', function() {
    var arg = '--txt';
    util.goCreateWithArgs('readme', [arg]);
    var filename = 'README.txt';
    util.fileCheck('should create README.txt documentation file', filename);
    util.fileContentCheck(filename, 'Check file content', /^# MyNamespace$/m);
  });

  describe.skip('aspnet:readme in cwd of project.json should contain correct project name', function() {
    var dir = util.makeTempDir();
    util.goCreateApplication('classlib', 'emptyTest', dir);
    util.goCreate('readme', path.join(dir, 'emptyTest'));
    util.fileCheck('should create README.md file', 'README.md');
    util.fileContentCheck('README.md', 'file content check', /^# emptyTest$/m);
  });

  describe.skip('aspnet:readme with --txt option in cwd of project.json should contain correct project name', function() {
    var arg = '--txt';
    var dir = util.makeTempDir();
    util.goCreateApplication('classlib', 'emptyTest', dir);
    util.goCreateWithArgs('readme', [arg], path.join(dir, 'emptyTest'));
    util.fileCheck('should create README.txt file', 'README.txt');
    util.fileContentCheck('README.txt', 'file content check', /^# emptyTest$/m);
  });

});

/*
 * Test for all subgenerators requiring a name argument
 */
describe.skip('Subgenerators with named arguments tests', function() {

  describe('aspnet:class without extension', function() {
    var arg = 'MyClass';
    var filename = 'MyClass.cs';
    util.goCreateWithArgs('class', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*class[ ]*MyClass/);
  });

  describe('aspnet:class with extension', function() {
    var filename = 'MyClass.cs';
    util.goCreateWithArgs('class', [filename]);
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*class[ ]*MyClass/);
  });

  describe('aspnet:class in cwd of project.json', function() {
    var dir = util.makeTempDir();

    util.goCreateApplication('classlib', 'emptyTest', dir);

    var arg = 'MyClass';
    var filename = 'MyClass.cs';
    console.log(arg, dir);

    util.goCreateWithArgs('class', [arg], path.join(dir, 'emptyTest'));
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*class[ ]*MyClass/);
    util.fileContentCheck(filename, 'Check file content', 'namespace emptyTest');
  });

  describe('aspnet:interface without extension', function() {
    var arg = 'IContact';
    var filename = 'IContact.cs';
    util.goCreateWithArgs('interface', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*interface[ ]*IContact/);
  });

  describe('aspnet:interface with extension', function() {
    var filename = 'IContact.cs';
    util.goCreateWithArgs('interface', [filename]);
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*interface[ ]*IContact/);
  });

  describe('aspnet:interface in cwd of project.json', function() {
    var dir = util.makeTempDir();

    util.goCreateApplication('classlib', 'emptyTest', dir);

    var arg = 'IContact';
    var filename = 'IContact.cs';
    console.log(arg, dir);
    util.goCreateWithArgs('interface', [arg], path.join(dir, 'emptyTest'));
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*interface[ ]*IContact/);
    util.fileContentCheck(filename, 'Check file content', 'namespace emptyTest');
  });

  describe('aspnet:middleware without extension', function() {
    var arg = 'MyMiddleware';
    var filename = 'MyMiddleware.cs';
    util.goCreateWithArgs('middleware', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*class[ ]*MyMiddleware/);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*static[ ]*class[ ]*MyMiddlewareExtensions/);
    util.fileContentCheck(filename, 'Check file content', /[ ]*IApplicationBuilder[ ]*UseMyMiddleware/);
  });

  describe('aspnet:middleware with extension', function() {
    var filename = 'MyMiddleware.cs';
    util.goCreateWithArgs('middleware', [filename]);
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*class[ ]*MyMiddleware/);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*static[ ]*class[ ]*MyMiddlewareExtensions/);
    util.fileContentCheck(filename, 'Check file content', /[ ]*IApplicationBuilder[ ]*UseMyMiddleware/);
  });

  describe('aspnet:middleware in cwd of project.json', function() {
    var dir = util.makeTempDir();

    util.goCreateApplication('classlib', 'emptyTest', dir);

    var arg = 'MyMiddleware';
    var filename = 'MyMiddleware.cs';
    console.log(arg, dir);

    util.goCreateWithArgs('middleware', [arg], path.join(dir, 'emptyTest'));
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*class[ ]*MyMiddleware/);
    util.fileContentCheck(filename, 'Check file content', 'namespace emptyTest');
  });

  describe('aspnet:json without extension', function() {
    var arg = 'file';
    var filename = 'file.json';
    util.goCreateWithArgs('json', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:json with extension', function() {
    var filename = 'file.json';
    util.goCreateWithArgs('json', [filename]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:jsx without extension', function() {
    var arg = 'file';
    var filename = 'file.jsx';
    util.goCreateWithArgs('jsx', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:jsx with extension', function() {
    var arg = 'file';
    var filename = 'file.jsx';
    util.goCreateWithArgs('jsx', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:mvccontroller without extension', function() {
    var arg = 'file';
    var filename = 'file.cs';
    util.goCreateWithArgs('mvccontroller', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:mvccontroller with extension', function() {
    var filename = 'file.cs';
    util.goCreateWithArgs('mvccontroller', [filename]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:mvccontroller in cwd of project.json', function() {
    var arg = 'file';
    var filename = 'file.cs';
    var dir = util.makeTempDir();

    util.goCreateApplication('mvc', 'webTest', dir);
    util.goCreateWithArgs('mvccontroller', [arg], path.join(dir, 'webTest'));

    util.fileCheck('should create Controllers/' + filename + ' file', filename);
  });

  describe('aspnet:mvcview without extension', function() {
    var arg = 'file';
    var filename = 'file.cshtml';
    util.goCreateWithArgs('mvcview', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:mvcview with extension', function() {
    var filename = 'file.cshtml';
    util.goCreateWithArgs('mvcview', [filename]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:mvcview in cwd of project.json', function() {
    var arg = 'file';
    var filename = 'file.cshtml';
    var dir = util.makeTempDir();

    util.goCreateApplication('mvc', 'webTest', dir);
    util.goCreateWithArgs('mvcview', [arg], path.join(dir, 'webTest'));
    util.fileCheck('should create Views/' + filename + ' file', filename);
  });

  describe('aspnet:class without extension', function() {
    var arg = 'CartTagHelper';
    var filename = 'CartTagHelper.cs';
    util.goCreateWithArgs('taghelper', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*class[ ]*CartTagHelper/);
  });

  describe('aspnet:class with extension', function() {
    var filename = 'CartTagHelper.cs';
    util.goCreateWithArgs('taghelper', [filename]);
    util.fileCheck('should create ' + filename + ' file', filename);
    util.fileContentCheck(filename, 'Check file content', /[ ]*public[ ]*class[ ]*CartTagHelper/);
  });

  describe('aspnet:webapicontroller without extension', function() {
    var arg = 'file';
    var filename = 'file.cs';
    util.goCreateWithArgs('webapicontroller', [arg]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:webapicontroller with extension', function() {
    var filename = 'file.cs';
    util.goCreateWithArgs('webapicontroller', [filename]);
    util.fileCheck('should create ' + filename + ' file', filename);
  });

  describe('aspnet:webapicontroller in cwd of project.json', function() {
    var arg = 'file';
    var filename = 'file.cs';
    var dir = util.makeTempDir();

    util.goCreateApplication('mvc', 'webTest', dir);
    util.goCreateWithArgs('webapicontroller', [arg], path.join(dir, 'webTest'));

    util.fileCheck('should create Controllers/' + filename + ' file', filename);
  });

});
