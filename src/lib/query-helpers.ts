export const getStringifiedNames = (nameList: string[]) => {
  const strigifiedNames = JSON.stringify(nameList);
  return strigifiedNames.slice(1, strigifiedNames.length - 1);
}