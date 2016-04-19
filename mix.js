function mix(options, object) {
  options = options || {};

  // mix options into the object
  for (var key in options) {
    object[key] = options[key];
  }
}
