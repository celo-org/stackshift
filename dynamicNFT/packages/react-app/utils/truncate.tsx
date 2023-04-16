export const truncate = (address : string ) => {
  const result = address.substring(0, 15)
  return `${result}...`
}

export const addComma = (stringArr: string[]) => {
  var result = "";
  for (var i = 0; i < stringArr.length; i++) {
    if (i > 0) {
      result += ", ";
    }
    result += stringArr[i];
  }
  console.log(result);
  return result
}