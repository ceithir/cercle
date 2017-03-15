export const acquireItem = function(itemKey, flags, updateFlag) {
  const item = Object.assign({}, flags["inventory"][itemKey], {acquired: true});
  updateFlag("inventory", Object.assign({}, flags.inventory, {itemKey: item}));
};
