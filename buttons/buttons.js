'use strict';

angular.module('app')

.component('buttons', {
  bindings: {
    folder: '=',
    selectedMessage: '='
  },
  controller: function() {},
  templateUrl: 'buttons/buttons-template.html'
})

.component('asUnreadButton', {
  bindings: {
    folder: '=',
    selectedMessage: '='
  },
  controller: function(MessagesService) {
    this.asUnread = message => {
      message.isUnread = !message.isUnread;
      MessagesService.updateMessage(message);
    };
  },
  templateUrl: 'buttons/as-unread-template.html'
})

.component('asImportantButton', {
  bindings: {
    folder: '=',
    selectedMessage: '='
  },
  controller: function(MessagesService) {
    this.asImportant = message => {
      message.isImportant = !message.isImportant;
      MessagesService.updateMessage(message);
    };
  },
  templateUrl: 'buttons/as-important-template.html'
})

.component('removeButton', {
  bindings: {
    folder: '=',
    selectedMessage: '='
  },
  controller: function(MessagesService, FoldersService, $state, $q) {

    this.remove = message => {
      MessagesService.getMessages
        .then(messages => {
          this.folder.messages--;
          let index = messages.findIndex(m => m._id === message._id);

        $q.all([
          FoldersService.updateFolder(this.folder),
          MessagesService.removeMessage(message)
        ]).then(message => {
              messages.splice(index, 1);
              $state.go('folder', {name: this.folder.name});
            });
          });
      
    };

  },
  templateUrl: 'buttons/remove-template.html'
})

.component('archiveButton', {
  bindings: {
    folder: '=',
    selectedMessage: '='
  },
  controller: function(MessagesService, FoldersService, $state, $q) {

    this.archive = message => {

      let archiveFolder = FoldersService.getFolderByName('archive');
      message.folderId = archiveFolder._id;
      archiveFolder.messages++;
      this.folder.messages--;

      $q.all([
        MessagesService.updateMessage(message),
        FoldersService.updateFolder(archiveFolder),
        FoldersService.updateFolder(this.folder)
      ]).then(() => $state.go('folder', {name: archiveFolder.name}))
        .catch(console.log);
      
    };

  },
  templateUrl: 'buttons/archive-template.html'
})

.component('spamButton', {
  bindings: {
    folder: '=',
    selectedMessage: '='
  },
  controller: function(MessagesService, FoldersService, $state, $q) {

    this.spam = message => {

      let spamFolder = FoldersService.getFolderByName('spam');
      message.folderId = spamFolder._id;
      spamFolder.messages++;
      this.folder.messages--;

      $q.all([
        MessagesService.updateMessage(message),
        FoldersService.updateFolder(spamFolder),
        FoldersService.updateFolder(this.folder)
      ]).then(() => $state.go('folder', {name: spamFolder.name}))
        .catch(console.log);
      
    };

  },
  templateUrl: 'buttons/spam-template.html'
})

.component('retrieveButton', {
  bindings: {
    folder: '=',
    selectedMessage: '='
  },
  controller: function(MessagesService, FoldersService, $state, $q) {

    this.retrieve = message => {

      let retrieveFolder = FoldersService.getFolderByName('inbox');
      message.folderId = retrieveFolder._id;
      retrieveFolder.messages++;
      this.folder.messages--;

      $q.all([
        MessagesService.updateMessage(message),
        FoldersService.updateFolder(retrieveFolder),
        FoldersService.updateFolder(this.folder)
      ]).then(() => $state.go('folder', {name: retrieveFolder.name}))
        .catch(console.log);
      
    };

  },
  templateUrl: 'buttons/retrieve-template.html'
});