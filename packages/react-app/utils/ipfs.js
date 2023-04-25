import axios  from 'axios'
import { IPFS_URL, FILE_TO_IPFS_URL, JSON_TO_IPFS_URL } from './constants'

export const imageToIPFS = async (image) => {

  let data = new FormData()

  data.append('file', image, image.name)
  data.append('pinataOptions', '{"cidVersion": 1}')

  let config = {
    method: 'post',
    url: FILE_TO_IPFS_URL,
    headers: {
      'Content-Type': `multipart/form-data boundary=${data._boundary}`,
      'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyYTg1ODU2Yi0xYmUyLTQyY2MtOTRkMC1hZGJhYmIwNjE0MDciLCJlbWFpbCI6ImNqdXN0aW5vYmlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjhmMmFlZjI2YzdmYTc3YWNiZmY2Iiwic2NvcGVkS2V5U2VjcmV0IjoiNDAzNmEwZDBjMzZjYzUyOTE3ZDA5MjlkY2ZlMTc4Njk3NTBmNjM1NGE3YzdiODE4ZDQzNGYxY2NlNDFhY2QyZSIsImlhdCI6MTY2Mzg4Mzc5N30.9_TyYUidh1Y-I67a4AXpmlVvf-WSwnq7RjydDDKe7cI'}`
      // 'Authorization': `Bearer ${process.env.PINATA_JWT}`
    },
    data
  }

  const res = await axios(config)

  return res.data.IpfsHash
}

export const JSONToIPFS = async(json) => {

  const res = await axios.post(JSON_TO_IPFS_URL, json, {
      headers: {
        'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyYTg1ODU2Yi0xYmUyLTQyY2MtOTRkMC1hZGJhYmIwNjE0MDciLCJlbWFpbCI6ImNqdXN0aW5vYmlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjhmMmFlZjI2YzdmYTc3YWNiZmY2Iiwic2NvcGVkS2V5U2VjcmV0IjoiNDAzNmEwZDBjMzZjYzUyOTE3ZDA5MjlkY2ZlMTc4Njk3NTBmNjM1NGE3YzdiODE4ZDQzNGYxY2NlNDFhY2QyZSIsImlhdCI6MTY2Mzg4Mzc5N30.9_TyYUidh1Y-I67a4AXpmlVvf-WSwnq7RjydDDKe7cI'}`
        // 'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`
      }
    })

  return `${IPFS_URL}${res.data.IpfsHash}`

}

export const getNFTMeta = async URI => {
  try {
    return (await axios.get(URI)).data
  } catch (e) {
    console.log({ e })
  }
}

