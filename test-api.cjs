const axios = require('axios');
const token = ""; // We might not need a token if there's no auth on dev, or maybe it fails. Let's see if we can get a token from localStorage? No browser context.
axios.get('http://localhost:5173/api/v1/admin/patient-manage/all-assessments/e0fe3772-fac9-4075-bc28-e22707591d95')
  .then(res => console.log(JSON.stringify(res.data.data, null, 2)))
  .catch(err => console.error(err.message));
