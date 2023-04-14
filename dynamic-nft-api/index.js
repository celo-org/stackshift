const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get(
  '/membership/0x2A6B7BA38BD8BED065C68361c383A77C160C5Fd7',
  (req, res) => {
    res.json({
      level: 1, // 0 = silver, 1 = gold, 2 = platinum
    })
  },
)

app.listen(8090, () => {
  console.log('Server running on port 8090')
})
