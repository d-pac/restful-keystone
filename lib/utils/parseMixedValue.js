"use strict";
var _ = require( "lodash" );

/**
 *
 * @param {boolean|string|string[]} value
 * @param defaultValue
 * @param emptyValue
 * @returns {*}
 */
module.exports = function parseMixedValue( value,
                                           defaultValue,
                                           emptyValue ){
  if( _.isUndefined( value ) ){
    value = true;
  }

  if( _.isString( value ) ){
    value = value.split( " " );
  } else if( _.isBoolean( value ) ){
    value = ( value )
      ? defaultValue
      : emptyValue;
  }
  return value;
};
