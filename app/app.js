'use strict';

var app = angular.module('app', ['ui.ace']);

app.controller('MainCtrl', function($scope) {

  // model to update with ace editor
  $scope.questionResult = {};
  $scope.sharedDoc;

  $scope.processForm = function() {
    console.log($scope.questionResult.answer);

    if ($scope.sharedDoc != null) {
      $scope.sharedDoc.close(function () {
        console.log("Doc closed");
        $scope.sharedDoc = null;
      });
    }
  };

  /**
   * Here we attach to shareJS after ui.ace directive loads ace
   * @param editor We attach shareJS to this obj
   */
  $scope.aceLoaded = function(editor) {
    console.log("Ace Loaded");

    // Options
    editor.setReadOnly(true);
    editor.getSession().setUseSoftTabs(true);
    editor.getSession().setTabSize(2);

    // Call shareJs
    var options = {
      origin: "http://localhost:8000/channel"
    };

    // FIXME replace 'code' with real uri path. Note doc names cannot contain slashes
    sharejs.open('code', 'text', options, function(error, doc) { // doc = handle to the server document
      if (error) {
        console.error(error);
        return;
      }
      // Keep reference to doc to close later
      $scope.sharedDoc = doc;

      console.log("shareJS connected");

      if (doc.created) {
        doc.insert(0, "# Coffeescript editor!\n\nexports.foo = ->\n  console.log 'hi!'");
      }

      doc.attach_ace(editor);
      console.log("Ace attached to shareJS");
      editor.setReadOnly(false);
    });
  };

});
