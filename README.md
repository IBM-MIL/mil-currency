# mil-currency
An AngularJS directive for a custom localized currency input field.

## Overview
Our directive is made so that it can be included as an attribute for an input field.
```
<input mil-currency>
```
It has the following features:
- It will only allow the user to type numbers and one period into the input field.
- On blur, the viewValue will be filtered with the AngularJS currency filter. The modelValue will be equal to the viewValue, but will not include the currency symbol. For example, the number 42.1 would be formatted as $42.10 (viewValue) and 42.10 (modelValue).

## Demo
See a demo of our directive [here](http://plnkr.co/edit/02eQG9aXahn0ntJP8fBu?p=preview).

## Download
Get our directive via npm with the following command
```
npm install mil-currency
```
or via bower
```
bower install mil-currency
```
