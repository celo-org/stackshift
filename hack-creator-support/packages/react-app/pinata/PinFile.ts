import axios from "axios"
const FormData = require("form-data");
// const JWT = `Bearer ${process.env.NEXT_APP_PINATA_JWT}`
const JWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmNzQwOGU5MC1mNmZmLTQ3N2EtOGRmYi02MmFmNjAxM2FhNjYiLCJlbWFpbCI6ImFnYXRldnVyZWdsb3J5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkNDIzN2Q3ODg3MGFhYTM1NWU3OCIsInNjb3BlZEtleVNlY3JldCI6Ijc1ODQ1MWJmZmEzNTYxMTI2NjE0MTMwZTRmZDcwZWYyYTk4NWM3ZmViZDZmN2EyMWQxMjhjYjk5ZTQ0NTViYjgiLCJpYXQiOjE2ODY2MjEwNTF9.OYdep-r1MOA-Y7YVXstpHJjB9Mldee3QfR-HNP2e1uo"
export const pinFileToPinata = async (selectedFile : string | File | number | readonly string[] | undefined) => {
  const formData = new FormData();
    
    formData.append('file', selectedFile)

    const metadata = JSON.stringify({
      name: 'Donation Dapp',
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);
    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
      console.log(res.data.IpfsHash);
      return res.data.IpfsHash
    } catch (error) {
      console.log(error);
    }
};