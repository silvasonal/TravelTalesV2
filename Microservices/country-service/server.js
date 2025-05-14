const express = require('express');
const cors = require('cors');
const { fetchCountry } = require('./countryService');
const app = express();

app.use(cors());

app.use(express.json());

app.get('/country/:name', async (req, res) => {
  const { name } = req.params;
  const result = await fetchCountry(name);

  if (result.error) {
    return res.status(404).json(result);
  }

  res.status(200).json(result);
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Country service running on port ${PORT}`);
});
