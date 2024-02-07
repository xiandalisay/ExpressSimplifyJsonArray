const express = require('express');

const axios = require('axios');
const app = express();
const port = 3000; // You can choose any port you prefer

function startServer() {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });


  // Define an endpoint
  app.get('/api/simplify-json-array', async (req, res) => {  
	try {
	  const { url, fieldNames } = req.query;
	  // Make a request to the provided URL
	  const response = await axios.get(url);


      // const response = {
      // 	data: {
      // 		data: [{
      // 			id: 1,
      // 			name: 'asd',
      // 			age: 12,
      // 			description: '1'
      // 		}, {
      // 			id: 2,
      // 			name: 'qwe',
      // 			age: 12,
      // 			description: '2'
      // 		}]
      // 	}
      // };

	  const fields = Array.isArray(fieldNames) ? fieldNames : (typeof fieldNames === 'string' || fieldNames instanceof String) ? [fieldNames]: [];
	    
	  // Extract only specified fields from the response data
      if (url) {
	    if(fields.length > 0) {

	      let simplifiedData = [];

	      //this corresponds to $.data.data
	      response.data.data.forEach(data => {
            const simplifiedObj = {};
	        fields.forEach(field => {
              if (data.hasOwnProperty(field)) {
	            simplifiedObj[field] = data[field];
	          }
	        });
            simplifiedData.push(simplifiedObj);
		  })
	      res.json(Object.assign({}, response,{ data: { data: simplifiedData } }));	
	    } else {
	      res.json(response);
	    }
	  } else {
		 res.status(404).json({ error: 'Url not found' });
	  }
	} catch (error) {
	  console.error('Error:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });
}

// Start the server
startServer();

// Error handling for server start failure
app.on('error', (err) => {
  console.error('Server error:', err);
  // Implement retry logic here
  setTimeout(startServer, 5000); // Retry after 5 seconds
});