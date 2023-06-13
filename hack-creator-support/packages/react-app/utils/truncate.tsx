export const truncate = (address: string) => `${address.substring(0, 5)}...`

export const removeSpace = (text: string) => text.replace(/\s/g, '')

export const convertHexToNumber = (hexString: string) => {
  const numberValue = parseInt(hexString, 16);
  return numberValue
}