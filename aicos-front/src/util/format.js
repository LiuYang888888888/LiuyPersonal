export function formateSize( size, pointLength, units ) {
  var unit;

  units = units || [ 'B', 'K', 'M', 'G', 'TB' ];

  while ( (unit = units.shift()) && size > 1024 ) {
    size = size / 1024;
  }

  return (unit === 'B' ? size : size.toFixed( pointLength || 2 )) +
    unit;
}
