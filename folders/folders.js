'use strict';

angular.module('app')

.component('foldersList', {
  bindings: {
    folders: '=',
    selectedFolder: '=',
    selectedMessage: '=',
    contactsIsActive: '='
  },
  controller: function(FoldersListService) {

    FoldersListService.getFolders()
      .then(folders => this.folders = folders)
      .then(() => this.selectedFolder = this.folders[0])
      .catch(console.error);

    this.selectFolder = function(folder) {
      this.selectedMessage = null;
      this.contactsIsActive = false;
      this.selectedFolder = folder;
    };
  },
  templateUrl: 'folders/folders-list-template.html'
})

.service('FoldersListService', function($http, HelperService) {
  let getUrl = HelperService.getUrl;

  this.getFolders = () => {
    return $http.get(getUrl('folders.json'))
      .then(res => HelperService.normalizeToArray(res.data));
  };

});