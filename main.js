'use strict';
//Dmitrii Solovev

//Вопросы:
//contacts-list-template.html - вопрос 25 строка

angular.module('app', ['ngMessages', 'ui.router'])

.config(function($stateProvider) {

  $stateProvider
    .state('mail', {
      url: '/mail',
      template: '<mail-box></mail-box>'
    })
    .state('folder', {
      parent: 'mail',
      url: '/folders/:folderId',
      templateUrl: 'messages/messages-template.html',
      controller: function($stateParams) {
        this.selectedFolderId = $stateParams.folderId;
      },
      controllerAs: '$ctrl'
    })
    .state('message', {
      parent: 'mail',
      url: '/messages/:messageId',
      templateUrl: 'messages/single-message-template.html',
      controller: function($stateParams) {
        this.messageId = $stateParams.messageId;
      },
      controllerAs: '$ctrl'
    })
    .state('newMessage', {
      parent: 'mail',
      url: '/new-message',
      template: '<new-message></new-message>'
    })
    .state('contacts', {
      url: '/contacts',
      templateUrl: 'contacts/contacts-template.html'
    });

})

// .run(function($state) {
//   $state.go('mail');
// })

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
