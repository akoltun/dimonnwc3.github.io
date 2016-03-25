'use strict';

angular.module('app')

.component('foldersList', {
  bindings: {},
  controller: function(FoldersListService, MessagesListService, $state) {

    FoldersListService.getFolders
      .then(folders => {
        this.folders = folders;
        $state.go('folder', {
          folderId: this.folders[0]._id
        });
      })
      .catch(console.error);

  },
  templateUrl: 'folders/folders-list-template.html'
})

.service('FoldersListService', function($http, HelperService) {
  let getUrl = HelperService.getUrl;

  this.getFolders = $http.get(getUrl('folders.json'))
      .then(res => this.folders = HelperService.normalizeToArray(res.data));

});