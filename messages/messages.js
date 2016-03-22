'use strict';

angular.module('app')

.component('messagesList', {
  bindings: {
    selectedFolder: '=',
    selectedMessage: '=',
    folders: '=',
    contacts: '='
  },
  controller: function(MessagesListService) {

    MessagesListService.getMessages()
      .then(messages => this.messages = messages)
      .catch(console.error);

    this.selectMessage = message => {
      message.isUnread = false;
      this.selectedMessage = message;
    };

    this.asUnread = message => {
      message.isUnread = !message.isUnread;
    };

    this.asImportant = message => {
      message.isImportant = !message.isImportant;
    };

    this.archive = message => {
      if (!message.oldFolderId) message.oldFolderId = this.selectedFolder._id;
      if (!message.oldFolderName) message.oldFolderName = this.selectedFolder.name;

      let folder = this.folders.find(f => f.name === 'archive');
      message.folderId = folder._id;
      this.selectedFolder.messages--;
      this.selectedFolder = folder;
      this.selectedFolder.messages++;
    };

    this.spam = message => {
      if (!message.oldFolderId) message.oldFolderId = this.selectedFolder._id;
      if (!message.oldFolderName) message.oldFolderName = this.selectedFolder.name;

      let folder = this.folders.find(f => f.name === 'spam');
      message.folderId = folder._id;
      this.selectedFolder.messages--;
      this.selectedFolder = folder;
      this.selectedFolder.messages++;
    };

    this.retrieve = message => {
      let folder = this.folders.find(f => f._id === message.oldFolderId);

      delete message.oldFolderId;
      delete message.oldFolderName;

      this.selectedFolder.messages--;
      message.folderId = folder._id;
      this.selectedFolder = folder;
      this.selectedFolder.messages++;
    };

    this.remove = message => {
      let index = this.messages.indexOf(message);
      this.messages.splice(index, 1);
      this.selectedMessage = null;
      this.selectedFolder.messages--;
    };


  },
  templateUrl: 'messages/messages-list-template.html'
})

.service('MessagesListService', function($http, HelperService) {
  let getUrl = HelperService.getUrl;

  this.getMessages = () => {
    return $http.get(getUrl('messages.json'))
      .then(res => HelperService.normalizeToArray(res.data));
  };

})

.directive('message', () => {
  return {
    restrict: 'A',
    scope: {
      message: '=',
      contacts: '='
    },
    templateUrl: 'messages/message-template.html'
  };
})

.component('messageView', {
  bindings: {
    selectedFolder: '=',
    selectedMessage: '=',
    asUnread: '&',
    asImportant: '&',
    remove: '&',
    archive: '&',
    spam: '&',
    retrieve: '&',
    getFullEmail: '&'
  },
  templateUrl: 'messages/single-message-view-template.html'
});