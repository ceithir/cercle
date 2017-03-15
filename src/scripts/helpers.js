const updateItem = function(element, itemKey, flags, updateFlag) {
  const item = Object.assign({}, flags["inventory"][itemKey], element);
  let flag = {};
  flag[itemKey] = item;
  updateFlag("inventory", Object.assign({}, flags.inventory, flag));
}

export const acquireItem = function(itemKey, flags, updateFlag) {
  updateItem({acquired: true}, itemKey, flags, updateFlag);
};

export const useItem = function(itemKey, flags, updateFlag) {
  updateItem({used: true}, itemKey, flags, updateFlag);
};
