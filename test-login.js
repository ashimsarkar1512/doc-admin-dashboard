const axios = require('axios');
axios.post('http://localhost:5000/api/v1/auth/login', {
  email: "muhammadabrrar921@gmail.com",
  password: "password123"
}).then(res => console.log(JSON.stringify(res.data, null, 2)))
.catch(err => console.log(err.response ? JSON.stringify(err.response.data, null, 2) : err.message));
