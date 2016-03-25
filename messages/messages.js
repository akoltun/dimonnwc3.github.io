'use strict';

angular.module('app')

.component('messagesList', {
  bindings: {
    selectedFolderId: '='
  },
  controller: function(MessagesListService, FoldersListService) {

    MessagesListService.getMessages
      .then(() => {
        this.messages = MessagesListService
          .getMessagesByFolderId(this.selectedFolderId);
      }).catch(console.error);

    FoldersListService.getFolders
      .then(folders => this.folders = folders)
      .catch(console.error);

    this.getFolderNameById = id => {
      if (!this.folders) return 'Load...';
      let folder = this.folders.find(f => f._id === id);
      return folder.name;
    };

  },
  templateUrl: 'messages/messages-list-template.html'
})

.service('MessagesListService', function($http, HelperService) {
  let getUrl = HelperService.getUrl;

  this.getMessages = $http.get(getUrl('messages.json'))
    .then(res => this.messages = HelperService.normalizeToArray(res.data));

  this.getMessagesByFolderId = id => this.messages
    .filter(m => m.folderId === id);

})

.directive('message', () => {
  return {
    restrict: 'A',
    scope: {
      message: '=',
    },
    templateUrl: 'messages/message-template.html'
  };
})

.component('messageView', {
  bindings: {
    messageId: '='
  },
  controller: function(MessagesListService, FoldersListService, $state) {

    MessagesListService.getMessages
      .then(messages => this.messages = messages)
      .then(() => {
        this.selectedMessage = this.messages
          .find(m => m._id === this.messageId);

        this.selectedMessage.isUnread = false;

        this.folder = this.folders
          .find(f => f._id === this.selectedMessage.folderId);
      }).catch(console.error);

    FoldersListService.getFolders
      .then(folders => this.folders = folders)
      .catch(console.error);

    this.asUnread = message => {
      message.isUnread = !message.isUnread;
    };

    this.asImportant = message => {
      message.isImportant = !message.isImportant;
    };

    this.archive = message => {
      if (!message.oldFolderId) message.oldFolderId = message.folderId;
      if (!message.oldFolderName) message.oldFolderName = this.folder.name;

      let folder = this.folders.find(f => f.name === 'archive');
      message.folderId = folder._id;
      this.folder.messages--;
      this.folder = folder;
      this.folder.messages++;
    };

    this.spam = message => {
      if (!message.oldFolderId) message.oldFolderId = this.folder._id;
      if (!message.oldFolderName) message.oldFolderName = this.folder.name;

      let folder = this.folders.find(f => f.name === 'spam');
      message.folderId = folder._id;
      this.folder.messages--;
      this.folder = folder;
      this.folder.messages++;
    };

    this.retrieve = message => {
      let folder = this.folders.find(f => f._id === message.oldFolderId);

      delete message.oldFolderId;
      delete message.oldFolderName;

      this.folder.messages--;
      message.folderId = folder._id;
      this.folder = folder;
      this.folder.messages++;
    };

    this.remove = message => {
      let index = this.messages.indexOf(message);
      this.messages.splice(index, 1);
      this.selectedMessage = null;
      this.folder.messages--;
      $state.go('folder', {
        folderId: this.folder._id
      });
    };

  },
  templateUrl: 'messages/single-message-view-template.html'
});