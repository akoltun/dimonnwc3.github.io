'use strict';

angular.module('app')

.component('mailApp', {
  bindings: {},
  controller: function() {
    this.pages = [
      { title: 'Mail', state: 'mail' },
      { title: 'Contacts', state: 'contacts' }
    ];
  },
  templateUrl: 'mailapp/mailapp-template.html'
});