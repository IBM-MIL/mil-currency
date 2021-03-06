'use strict';

/**
 * @description Angular Directive for a localized currency input field
 * @return {Boolean} True if the input is allowed, False otherwise
 */
angular.module('mil', [])
  .directive('milCurrency', ['$filter', '$document', '$locale', function($filter, $document, $locale) {
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 2,
      link: function(scope, element, attrs, ngModel) {
        var curSymbol = $locale.NUMBER_FORMATS.CURRENCY_SYM;
        var curGroupSep = $locale.NUMBER_FORMATS.GROUP_SEP;
        var curDecimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
        var decimalSepChar = curDecimalSep.charCodeAt(0);
        var maxFract = $locale.NUMBER_FORMATS.PATTERNS[1].maxFrac;

        //character codes
        var period = 46;
        var comma = 44;
        var zero = 48;
        var nine = 57;
        var unitSeperator = 31;

        // handles changes in modelValue and display of viewValue
        // only needed on load
        ngModel.$formatters.push(function(value) {
          if(!isNaN(parseFloat(value)) && parseFloat(value) !== 0){
            return $filter('currency')(value, curSymbol);
          }
        });

        // handles changes in viewValue and storing of modelValue
        ngModel.$parsers.push(function(value) {
          var groupRegex = new RegExp(curGroupSep, 'g');
          var valueSansGroup = value.replace(groupRegex, '');
          var modelArray = valueSansGroup.split(curSymbol);

          return ( (modelArray.length === 2) ? modelArray[1] : modelArray[0] );
        });

        /**
         * @function getCursorPosition
         * @param  {element} field The imput element the focus is on
         * @return {Int}       The cursor's position within the selected element
         */
        function getCursorPosition(field) {
          var cursorPos = 0;
          // IE Support
          if($document[0].selection) {
            // Set focus on the element
            field.focus();

            // To get cursor position, get empty selection range
            var oSel = $document[0].selection.createRange();

            // Move selection start to 0 position
            oSel.moveStart('character', -field.value.length);

            // The caret position is selection length
            cursorPos = oSel.text.length;
          }

          // Firefox support
          else if(field.selectionStart || field.selectionStart === '0'){
            cursorPos = field.selectionStart;
          }

          return cursorPos;
        }

        // restrict input to only numbers
        element.bind('keypress', function(event) {
          var charCode = (event.which) ? event.which : event.keyCode;
          //prevent anything but a number from being added
          var sep = '';
          if(curDecimalSep === ',') {
            sep = comma;
          } else {
            sep = period;
          }
          if(charCode !== sep && charCode > unitSeperator && (charCode < zero || charCode > nine)) {
            event.returnValue = false;
            event.preventDefault();
            return false;
          }
          //restricts decimal seperator to one
          else if(charCode === decimalSepChar && event.target.value.split(curDecimalSep).length > 1) {
            //replace target with srcElement for IE
            event.returnValue = false;
            event.preventDefault();
            return false;
          }
          else {
            //stops user from adding a currency seperator if it would have more than 2 trailing numbers
            if(charCode === decimalSepChar) {
              var pos = getCursorPosition(event.target);
              if(pos > (event.target.value.length - maxFract + 1)) {
                return true;
              }
              else {
                event.returnValue = false;
                event.preventDefault();
                return false;
              }
            }
            //stops user from adding more than 2 numbers after a currency seperator
            var pos2 = getCursorPosition(event.target);
            if((event.target.value.split(curDecimalSep)[1] != null && event.target.value.split(curDecimalSep)[1].length > 1) && pos2 > (event.target.value.length - (maxFract + 1))) {
              event.returnValue = false;
              event.preventDefault();
              return false;
            }
            return true;
          }
        });

        element.bind('blur', function() {
          ngModel.$setViewValue($filter('currency')(ngModel.$modelValue, curSymbol));
          ngModel.$render();
        });
      }
    };
}]);
