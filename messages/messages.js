'use strict';


angular.module('app')

.component('messagesList', {
  bindings: {
    folders: '=',
    messages: '='
  },
  controller: function($stateParams, MessagesService, FoldersService) {

    MessagesService.getMessages
      .then(messages => {
        this.selectedFolder = FoldersService.getFolderByName($stateParams.name);

        this.messages = messages
          .filter(m => m.folderId === this.selectedFolder._id);
      });

  },
  templateUrl: 'messages/messages-list-template.html'
})

.service('MessagesService', function($http, HelperService) {

  let getUrl = HelperService.getUrl;

  this.getMessages = $http.get(getUrl('messages.json'))
    .then(res => this.messages = HelperService.normalizeToArray(res.data));

  this.addMessage = message => {
    return $http.post(getUrl('messages.json'), message)
      .then(res => {
        message._id = res.data.name;
        return message;
      });
  };

  this.updateMessage = message => {
    let id = message._id;
    delete message._id;
    return $http.put(getUrl('messages/' + id + '.json'), message)
      .then(res => message._id = id);
  };

  this.removeMessage = message => {
    return $http.delete(getUrl('messages/' + message._id + '.json'));
  };
  
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

.component('singleMessage', {
  bindings: {
    folders: '=',
    selectedMessage: '='
  },
  controller: function($stateParams, FoldersService, MessagesService) {

    MessagesService.getMessages
      .then(messages => {
        this.selectedMessage = messages.find(m => m._id === $stateParams.id);

        if (this.selectedMessage.isUnread) {
          this.selectedMessage.isUnread = false;
          MessagesService.updateMessage(this.selectedMessage);
        }

        this.folder = FoldersService
          .getFolderById(this.selectedMessage.folderId);
      });

  },
  templateUrl: 'messages/single-message-template.html'
})

.component('newMessage', {
  bindings: {},
  controller: function(MessagesService, FoldersService, $state, $q) {

     MessagesService.getMessages.then(messages => this.messages = messages);

    this.sendMessage = message => {
      message.date = new Date().toISOString();
      message.isUnread = false;
      message.isImportant = false;

      let folder = FoldersService.getFolderByName('sent');
      folder.messages++;
      message.folderId = folder._id;

      $q.all([
        FoldersService.updateFolder(folder),
        MessagesService.addMessage(message)
      ]).then(res => {
          this.messages.push(message);
          $state.go('folder', {name: folder.name});
        });
    };

    this.clearMessage = message => {
      message.to = '';
      message.subject = '';
      message.content = '';
    };

    this.message = {
      from: 'steve@example.com'
    };

  },
  templateUrl: 'messages/new-message-form-template.html'
});
