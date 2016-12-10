export default function (/* arg1, arg2 */) {
  return this.lookup('explode').call(this, {
    pick: '.modal-background',
    use: ['fade', { maxOpacity: 0.5}]
  }, {
    pick: '.modal-content',
    use: 'scale'
  });
}
