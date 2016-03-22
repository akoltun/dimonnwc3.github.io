'use strict';
//Dmitrii Solovev

//Вопросы:
//contacts-list-template.html - вопрос 25 строка

angular.module('app', ['ngMessages'])

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
