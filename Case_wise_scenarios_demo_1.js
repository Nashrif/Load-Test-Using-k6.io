import http from 'k6/http';
import { sleep, check } from 'k6';
import { parseHTML } from "k6/html";
//import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
//import { SharedArray } from "k6/data";
//import { Rate } from 'k6/metrics';
const domain = 'https://miamicrypto-qa.nuarcalabsnft.com/#/';
//const login = 'https://miamicrypto-qa.nuarcalabsnft.com/login'; // Parameterize the domain to make it easier to change environments.

/*
//creating new matrics.
const failuers = new Rate('failed requests');
*/

export let options = {
  scenarios: {
      home: {
          executor: 'ramping-vus',
          exec: 'S01_HomeOnly',
          startVUs: 0,
          stages: [
              { duration: '60s', target: 100 },
              { duration: '30s', target: 250 },
          ],
          gracefulRampDown: '60s', //iterations that should be stopped because we ramp down the number of VUs.
      },
      /*logIn: {
          executor: 'ramping-vus',
          exec: 'S02_Login',
          startVUs: 0,
          stages: [
              { duration: '60s', target: 200 },
              { duration: '30s', target: 500 },
          ],
          gracefulRampDown: '60s', //iterations that should be stopped because we ramp down the number of VUs.
      }, */
  },
  // Set limits for acceptable performance during the load test.
  thresholds: {
      http_req_failed: ['rate<0.05'], // The HTTP error rate (HTTP 4xx or 5xx) should be less than 5%.
      http_req_duration: ['p(95)<3000'], // 95% of requests should be below 3000 ms.
      checks: ['rate>0.95'], // Checks should have a success rate of greater than 95%.
      //failed_requests: ['rate<0.05'],// failed request have a failuar rate less than 5%.
  },
};

// Define Scenario 1.(By GET Method)
export function S01_HomeOnly () {
  VisitHomePage();
}
/*
// Define Scenario 2.(By Post Method)
export function S02_Login () {
  LogIn();
}
*/

export function VisitHomePage () {
    // Do an HTTP GET of the homepage, and name this request 01_Home for ease of analysis.
    let response = http.get(domain, {tags: { name: '01_Home' }});
    
    // Verify text returned in the response. An HTTP 200 response means a page was returned; not necessarily the right one.
    check(response, {
      '01 - home page status code is 200': (r1) => r1.status==200
    });
    //failuers.add(response.status !== 200);
    /*
    // Add dynamic think time between 0 and 4s.
    sleep(Math.random() * 5);
    */
}
/*
export function VisitStorePage () {
    var siteAbbr = 'nwl';
    // Do an HTTP GET of the homepage, and name this request 01_Home for ease of analysis.
    let response = http.get( 'https://myodis-webapi-qa.azurewebsites.net/store?siteAbbr='+siteAbbr ,{tags: { name: '02_store_page' }});
  
    // Verify text returned in the response. An HTTP 200 response means a page was returned; not necessarily the right one.
    check(response, {
      '03 - Store page status code is 200': (r2) => r2.status==200
    });
}
*/
/*
export function LogIn () {
  // Define the payload and convert to json to be sent with the HTTP POST.
  let payload = JSON.stringify ({
    adClaimAud: "5c84ea8b-5493-473d-bd60-9e2c33007b96",
    adClaimAuthTime: 1629194148,
    adClaimEmails: "gacege3233@error57.com",
    adClaimExp: 1629197750,
    adClaimIss: "https://nuarcab2clabtestqa.b2clogin.com/59968f01-264d-43e5-b414-ab96548463a1/v2.0/",
    adClaimName: "Test",
    adClaimNbf: 1629194150,
    adClaimNonce: "9788989a-3df9-4789-ad0f-19547899c308",
    adClaimOid: "be8fc1dd-b16d-4170-bf71-c1267559aaea",
    adClaimSub: "be8fc1dd-b16d-4170-bf71-c1267559aaea",
    adClaimTfp: "B2C_1_SUSI",
    adClaimVer: "1.0",
    adToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJleHAiOjE2MjkxOTc3NTAsIm5iZiI6MTYyOTE5NDE1MCwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9udWFyY2FiMmNsYWJ0ZXN0cWEuYjJjbG9naW4uY29tLzU5OTY4ZjAxLTI2NGQtNDNlNS1iNDE0LWFiOTY1NDg0NjNhMS92Mi4wLyIsInN1YiI6ImJlOGZjMWRkLWIxNmQtNDE3MC1iZjcxLWMxMjY3NTU5YWFlYSIsImF1ZCI6IjVjODRlYThiLTU0OTMtNDczZC1iZDYwLTllMmMzMzAwN2I5NiIsIm5vbmNlIjoiOTc4ODk4OWEtM2RmOS00Nzg5LWFkMGYtMTk1NDc4OTljMzA4IiwiaWF0IjoxNjI5MTk0MTUwLCJhdXRoX3RpbWUiOjE2MjkxOTQxNDgsIm9pZCI6ImJlOGZjMWRkLWIxNmQtNDE3MC1iZjcxLWMxMjY3NTU5YWFlYSIsIm5ld1VzZXIiOnRydWUsIm5hbWUiOiJUZXN0IiwiZ2l2ZW5fbmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IjAxIiwiZW1haWxzIjpbImdhY2VnZTMyMzNAZXJyb3I1Ny5jb20iXSwidGZwIjoiQjJDXzFfU1VTSSJ9.JRWlYRRbeFVF7AbCIs6d1l2LklbKo7HT50NAYBgDkb7zZuTLeSZ7o0rsogpOX0d3oeRzRzpPk65GZHQ3dnwcOWIlVkiyZPiMHS83gI_a3gqFqDpMVkFCW6bs2gh67KA5HkJrfWQQFn49h7i5IdsUwX9WJeXTgyWrQrjIkVfaSORu18RWs5QAKw0cdWQt6xu60qVMFIFtHRAfzl9gyzQTOgYa1UVuTMbBtsPXorsy4OJrg6bc9N4DKrm0uj66qJPwaWyQZij8B2RjGCFJqOJlI5LiclrTf8_j1ZH-3OpgktwoJTBKsIYrFsQBo4A1vuO9p_CsCPHOzuUfWSFAXeftow",
    id: 9,
    torusPublicKey: "0xb82d6a2Ed07F2ECb642C97315744edf8273aF965",
  });
  // set the paraitter and the header json file
  let params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

  // Submit login credentials via an HTTP POST.
  let response = http.post(
      login,
      payload, 
      params,
  );
  /*
  // print the status code on terminal.
  console.log(JSON.stringify(response.status)+ '\n\n\n');
  */
  /*
  //Verify successful login by checking the response code"
    check(response, {
        '02 - After Succesful Login, status code is 200':r => r.status == 200
      
  });
  //failuers.add(response.status !== 200);
  // Add dynamic think time between 0 and 14s to allow for time to type login credentials.
  //sleep(Math.random() * 15);
  
}*/