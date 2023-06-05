export const convertDateToTimeStamp = (date : string) => {
  // date in this format '2023-04-30T15:32'
  const timestamp = Date.parse(date) / 1000;
  return timestamp;
}

export const dateToTimeStamp = () => {
  let dateString = new Date();
  let timestamp = new Date(dateString).getTime() / 1000;
  console.log(timestamp); // Output: 1680151186
  return timestamp
}

export const convertStartTime = (startTimeTimestamp : number) => {
  let startDate: any = new Date(startTimeTimestamp * 1000);
  let currentDate: any = new Date();
  let timeDiffInSeconds = Math.floor((startDate - currentDate) / 1000);
  let timeDiffInDays = Math.floor(timeDiffInSeconds / (24 * 60 * 60));
  let timeDiffInHours = Math.floor((timeDiffInSeconds % (24 * 60 * 60)) / (60 * 60));
  console.log(`Start time is ${timeDiffInDays} days and ${timeDiffInHours} hours from now.`);

  return `Start in ${timeDiffInDays} days and ${timeDiffInHours} hours.`
}


export const convertEndTime = (endTimeTimestamp : number) => {
  let endDate: any = new Date(endTimeTimestamp * 1000);
  let currentDate: any = new Date();
  let timeDiffInSeconds = Math.floor((endDate - currentDate) / 1000);
  let timeDiffInDays = Math.floor(timeDiffInSeconds / (24 * 60 * 60));
  let timeDiffInHours = Math.floor((timeDiffInSeconds % (24 * 60 * 60)) / (60 * 60));
  console.log(`Start time is ${timeDiffInDays} days and ${timeDiffInHours} hours from now.`);

  return `Ends in  ${timeDiffInDays} days and ${timeDiffInHours} hours.`
}

export const convertEnded = (endTimeTimestamp : number) => {
  let endDate: any = new Date(endTimeTimestamp * 1000);
  let currentDate: any = new Date();
  let timeDiffInSeconds = Math.floor((currentDate - endDate) / 1000);
  let timeDiffInDays = Math.floor(timeDiffInSeconds / (24 * 60 * 60));
  let timeDiffInHours = Math.floor((timeDiffInSeconds % (24 * 60 * 60)) / (60 * 60));
  console.log(`Start time is ${timeDiffInDays} days and ${timeDiffInHours} hours from now.`);

  return `Ended  ${timeDiffInDays} days and ${timeDiffInHours} hours ago.`
}


export const formatTimestamp = (timestamp : number) => {
  // const timestamp = 1620230400; // Unix timestamp for May 6, 2021, 00:00:00 UTC

  const date = new Date(timestamp * 1000); // multiply by 1000 to convert to milliseconds

  const options : any = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    timeZone: 'UTC' 
  }; // specify the formatting options

  const formattedDate = date.toLocaleDateString('en-US', options); // convert to formatted string

  console.log(formattedDate); // output: "May 6, 2021, 12:00:00 AM"
  return formattedDate
}