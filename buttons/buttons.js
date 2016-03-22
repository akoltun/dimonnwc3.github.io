'use strict';

angular.module('app')

.component('buttons', {
  bindings: {
    selectedFolder: '=',
    selectedMessage: '=',
    asUnread: '=',
    asImportant: '=',
    remove: '=',
    archive: '=',
    spam: '=',
    retrieve: '='
  },
  templateUrl: 'messages/buttons-template.html'
});