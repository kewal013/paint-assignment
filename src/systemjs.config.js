/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      'app': 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      'ng2-drag-drop': 'node_modules/ng2-drag-drop',
      'angular2-color-picker': 'node_modules/angular2-color-picker',
      'html2canvas': 'npm:html2canvas/dist/html2canvas.js',
      'dom-to-image': 'npm:dom-to-image/dist/dom-to-image.min.js',
      'downloadjs': './scripts/lib/download.min.js',
      "ng2-dropdown": "node_modules/ng2-dropdown",
      "svgpath": "node_modules/svgpath",
      // "angular2-context-menu":"node_modules/angular2-context-menu",

      // other libraries
      'rxjs': 'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        defaultExtension: 'js',
        meta: {
          './*.js': {
            loader: 'systemjs-angular-loader.js'
          }
        }
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'ng2-drag-drop': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'angular2-color-picker': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      "ng2-dropdown": { "main": "index.js", "defaultExtension": "js" },
      "svgpath":{"main": "index.js", "defaultExtension": "js"}
    }
  });
})(this);
