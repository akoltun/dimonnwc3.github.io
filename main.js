'use strict';
//Dmitrii Solovev


angular.module('app', ['ngMessages', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/mail/folder/inbox');

  $stateProvider
    .state('mail', {
      url: '/mail',
      template: `<mail-box folders="$ctrl.folders"
                            messages="$ctrl.messages">
                 </mail-box>`
    })
    .state('folder', {
      parent: 'mail',
      url: '/folder/:name',
      template: `<messages-list folders="$ctrl.folders"
                                messages="$ctrl.messages"
                                selected-message="$ctrl.selectedMessage">
                 </messages-list>`
    })
    .state('message', {
      parent: 'mail',
      url: '/message/:id',
      template: `<single-message folders="$ctrl.folders"
                                 messages="$ctrl.messages"
                                 selected-message="$ctrl.selectedMessage">
                 </single-message>`
    })
    .state('new-message', {
      parent: 'mail',
      url: '/new-message',
      template: '<new-message></new-message>'
    })
    .state('contacts', {
      url: '/contacts',
      template: `<contacts-list></contacts-list>`
    });

})

.run(function(FoldersService, MessagesService, ContactService) {
  FoldersService.getFolders;
  MessagesService.getMessages;
  ContactService.getContacts;
})

.service('HelperService', function() {

  let url = 'https://mailappp.firebaseio.com/';
  this.getUrl = string => url + string;

  this.normalizeToArray = object => {
    if (!object) return [];
    return Object.keys(object).map(key => {
      let normalizedObject = object[key];
      normalizedObject._id = key;
      return normalizedObject;
    });
  };

});