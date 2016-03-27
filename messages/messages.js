'use strict';

angular.module('app')

.component('messagesList', {
  bindings: {
    selectedFolderId: '='
  },
  controller: function(MessagesListService, FoldersListService, $state) {

    MessagesListService.getMessages
      .then(messages => this.messages = messages);

    FoldersListService.getFolders
      .then(folders => this.folders = folders)
      .catch(console.error);

    this.getFolderNameById = id => {
      if (!this.folders) return 'Load...';
      let folder = this.folders.find(f => f._id === id);
      return folder.name;
    };

    this.getMessagesCount = id => {
      if (!this.folders) return 'Load...';
      let folder = this.folders.find(f => f._id === id);
      return folder.messages;
    };

  },
  templateUrl: 'messages/messages-list-template.html'
})

.service('MessagesListService', function($http, HelperService, FoldersListService, $state) {
  let getUrl = HelperService.getUrl;

  this.getMessages = $http.get(getUrl('messages.json'))
    .then(res => this.messages = HelperService.normalizeToArray(res.data));

  FoldersListService.getFolders
      .then(folders => this.folders = folders)
      .catch(console.error);

  this.addMessage = message => {

    message.date = new Date().toISOString();
    let folder = this.folders.find(f => f.name === 'sent');
    folder.messages++;
    message.folderId = folder._id;
    message.isUnread = false;
    message.isImportant = false;

    FoldersListService.updateFolder(folder)
        .then(data => {
          folder._id = data._id;
        });

    $http.post(getUrl('messages.json'), message)
      .then(res => {
        message._id = res.data.name;
        this.messages.push(message);
      }).then(() => {
        $state.go('folder', {
          folderId: message.folderId
        });
      });
  };

  this.updateMessage = message => {

    if (!message._id) return this.addMessage(message);

    let id = message._id;
    delete message._id;
    return $http.put(getUrl('messages/' + id + '.json'), message)
      .then(res => {
        message = res.data;
        message._id = id;
        return message;
      });

  };

  this.removeMessage = message => {
    return $http.delete(getUrl('messages/' + message._id + '.json'))
      .then(res => res.data);
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
        MessagesListService.updateMessage(this.selectedMessage)
          .then(data => {
            this.selectedMessage._id = data._id;
          });

        this.folder = this.folders
          .find(f => f._id === this.selectedMessage.folderId);
      }).catch(console.error);

    FoldersListService.getFolders
      .then(folders => this.folders = folders)
      .catch(console.error);

    this.asUnread = message => {
      message.isUnread = !message.isUnread;
      MessagesListService.updateMessage(message)
        .then(data => {
          Object.assign(message, data);
        });
    };

    this.asImportant = message => {
      message.isImportant = !message.isImportant;
      MessagesListService.updateMessage(message)
        .then(data => {
          Object.assign(message, data);
        });
    };

    this.archive = message => {

      if (!message.oldFolderId) message.oldFolderId = message.folderId;
      if (!message.oldFolderName) message.oldFolderName = this.folder.name;

      let folder = this.folders.find(f => f.name === 'archive');
      message.folderId = folder._id;

      MessagesListService.updateMessage(message)
        .then(data => {
          Object.assign(message, data);
        });

      this.folder.messages--;
      FoldersListService.updateFolder(this.folder)
        .then(data => {
          this.folder._id = data._id;
          this.folder = folder;
          this.folder.messages++;
          return FoldersListService.updateFolder(this.folder);
        })
        .then(data => {
          this.folder._id = data._id;
        });

    };

    this.spam = message => {
      if (!message.oldFolderId) message.oldFolderId = this.folder._id;
      if (!message.oldFolderName) message.oldFolderName = this.folder.name;

      let folder = this.folders.find(f => f.name === 'spam');
      message.folderId = folder._id;

      MessagesListService.updateMessage(message)
        .then(data => {
          Object.assign(message, data);
        });

      this.folder.messages--;
      FoldersListService.updateFolder(this.folder)
        .then(data => {
          this.folder._id = data._id;
          this.folder = folder;
          this.folder.messages++;
          return FoldersListService.updateFolder(this.folder);
        })
        .then(data => {
          this.folder._id = data._id;
        });

    };

    this.retrieve = message => {

      let folder = this.folders.find(f => f._id === message.oldFolderId);

      delete message.oldFolderId;
      delete message.oldFolderName;

      this.folder.messages--;
      FoldersListService.updateFolder(this.folder)
        .then(data => {
          this.folder._id = data._id;
          this.folder = folder;
          this.folder.messages++;
          return FoldersListService.updateFolder(this.folder);
        })
        .then(data => {
          this.folder._id = data._id;
        });

      message.folderId = folder._id;
      MessagesListService.updateMessage(message)
        .then(data => {
          Object.assign(message, data);
        });

    };

    this.remove = message => {
      let index = this.messages.indexOf(message);
      this.messages.splice(index, 1);
      this.selectedMessage = null;
      this.folder.messages--;
      
      MessagesListService.removeMessage(message)
        .then(message => FoldersListService.updateFolder(this.folder))
        .then(data => this.folder._id = data._id)
        .then(id => {
          $state.go('folder', {
            folderId: id
          });
        });
    };

  },
  templateUrl: 'messages/single-message-view-template.html'
})

.component('writeMessage', {
  bindings: {},
  templateUrl: 'messages/write-message-template.html'
})

.component('newMessage', {
  bindings: {},
  controller: function(MessagesListService, $state) {

    this.addMessage = MessagesListService.addMessage;

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