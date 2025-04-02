import { action } from "@ember/object";
const Component = {
  test() {},
  method: action(function() {}),
  anotherMethod: action(function(param) {}),
  expr: action(function() {}),
  testAction: action(function() {})
};