'use strict';

angular.module('app')

.component('foldersList', {
  bindings: {
    folders: '=',
    selectedMessage: '='
  },
  controller: function(FoldersService, $state) {

    FoldersService.getFolders
      .then(folders => this.folders = folders)
      .then(() => {
        let state = $state.current.name;
        if (state === 'mail') $state.go('folder', {name: this.folders[0].name});
      });

  },
  templateUrl: 'folders/folders-list-template.html'
})

.service('FoldersService', function($http, HelperService) {

  let getUrl = HelperService.getUrl;

  this.getFolders = $http.get(getUrl('folders.json'))
    .then(res => this.folders = HelperService.normalizeToArray(res.data));

  this.updateFolder = folder => {
    let id = folder._id;
    delete folder._id;
    return $http.put(getUrl('folders/' + id + '.json'), folder)
      .then(res => folder._id = id);
  };

  this.getFolderByName = name => this.folders.find(f => f.name === name);
  this.getFolderById = id => this.folders.find(f => f._id === id);

});