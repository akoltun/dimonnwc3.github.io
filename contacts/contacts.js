'use strict';

angular.module('app')

.component('contacts', {
  bindings: {
    selectedFolder: '=',
    selectedMessage: '=',
    contactsIsActive: '='
  },
  controller: function() {
    this.showContacts = () => {
      this.selectedFolder = null;
      this.selectedMessage = null;
      this.contactsIsActive = true;
    };
  },
  templateUrl: 'contacts/contacts-template.html'
})

.component('contactsList', {
  bindings: {
    contacts: '='
  },
  controller: function(ContactService) {

    this.savedContact = {};

    ContactService.getContacts
      .then(contacts => this.contacts = contacts)
      .catch(err => console.error(err));

    this.createContact = () => {
      //при добавлении контакта он улетает вниз и при написании первой буквы
      //он сортируется по альфавиту,
      //как отключить временно сортировку или решить данную проблему
      this.contacts.push({});
    };

    this.updateContact = contact => {
      ContactService.updateContact(contact)
        .then(data => {
          contact._id = data._id;
        });
    };

    this.removeContact = contact => {
      ContactService.removeContact(contact)
        .then(() => {
          this.contacts.splice(this.contacts.indexOf(contact), 1);
        });
    };

  },
  templateUrl: 'contacts/contacts-list-template.html'
})

.component('contactCard', {
  bindings: {
    contact: '=',
    editableContact: '=',
    removeContact: '&',
    updateContact: '&',
    savedContact: '='
  },
  controller: function() {

    this.saveChanges = contact => {
      this.updateContact({contact: contact});
      this.editableContact = null;
      this.savedContact = {};
    };

    this.startEdit = contact => {
      if (this.editableContact) this.cancelEdit(this.editableContact);
      Object.assign(this.savedContact, contact);
      this.editableContact = contact;
    };

    this.cancelEdit = contact => {
      Object.assign(contact, this.savedContact);
      this.editableContact = null;
      this.savedContact = {};
    };

  },
  templateUrl: 'contacts/contact-card-template.html'
})

.service('ContactService', function($http, HelperService) {

  let getUrl = HelperService.getUrl;

  this.getContacts = this.updateContacts = $http.get(getUrl('contacts.json'))
    .then(res => HelperService.normalizeToArray(res.data));

  this.addContact = conctact => {
    return $http.post(getUrl('contacts.json'), conctact)
      .then(res => {
        conctact._id = res.data.name;
        return conctact;
      });
  };

  this.updateContact = contact => {

    if (!contact._id) return this.addContact(contact);

    let id = contact._id;
    delete contact._id;
    return $http.put(getUrl('contacts/' + id + '.json'), contact)
      .then(res => {
        contact = res.data;
        contact._id = id;
        return contact;
      });
  };

  this.removeContact = contact => {
    return $http.delete(getUrl('contacts/' + contact._id + '.json'))
      .then(res => res.data);
  };


});