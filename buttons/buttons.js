'use strict';

angular.module('app')

.component('buttons', {
  bindings: {
    folder: '=',
    selectedMessage: '=',
    asUnread: '&',
    asImportant: '&',
    remove: '&',
    archive: '&',
    spam: '&',
    retrieve: '&'
  },
  controller: function() {
  },
  templateUrl: 'messages/buttons-template.html'
});