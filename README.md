# 0.Demo video link 
youtube link : https://youtu.be/lysvwqN1rh0
# 1. **Introduction**

The **Real-Time Currency Converter** is a highly valuable tool for society as it solves the problem of constantly fluctuating currency exchange rates. In a globalized world, businesses, travelers, and individuals need to quickly and accurately convert currencies for transactions, investments, or travel purposes. This application ensures that users have up-to-date exchange rates, helping them make informed financial decisions, reduce the risk of financial losses due to outdated data, and plan their spending more effectively.

The tool simplifies the process of currency conversion, making it accessible to anyone with an internet connection, and it plays a key role in facilitating international trade, tourism, and personal financial planning.


This guide walks us through the deployment of the Real-Time Currency Converter application on two web servers and the configuration of HAProxy as a load balancer to distribute traffic between the servers. The application is a web application service that allows users to convert between different currencies in real time.

We will do the following:

- Deploy the application on two web servers.

- Set up HAProxy on a third server to balance traffic between the web servers.

- Test the application and load balancing to ensure traffic is distributed evenly and the application remains accessible.

# 2. **Prerequisites**

Before starting, we should ensure that we have the following:

- Two Ubuntu web servers (Web01 and Web02).

- One Ubuntu load balancer server (lb-01).

- SSH access to all servers.

- The application ready for deployment.

- HAProxy installed on the load balancer (lb-01).

- Basic understanding of HAProxy, and Linux server management.

# 3. **Deployment Steps**

- Deploying the Application to Web Servers
The application is deployed on two web servers to ensure redundancy.
- Installing and Configuring HAProxy for Load Balancing
The load balancer will ensure that traffic is evenly distributed between the two web servers. We will install and configure HAProxy on the load balancer server (lb-01).

# 4. **Testing**

- Testing the Application
After deploying the application and setting up the load balancer, you can test the Real-Time Currency Converter by accessing the load balancer’s IP address in a web browser.
- Testing Load Balancing
To verify that HAProxy is properly balancing traffic between the two web servers

# 5.**Troubleshooting**

If you encounter issues, here are some troubleshooting steps:

## the Application Not Responding:

- Ensure that app is running on both Web01 and Web02.

- Verify that the correct IP and port are being used.

## HAProxy Issues
- Check HAProxy’s status
- Check the HAProxy logs for errors

## Firewall

Ensure that HTTP (port 80) is open on both web servers and the load balancer.

# 6. API USED and Giving credits
When developing this application to fetch real-time currency conversion data different API were used so,  
Special thanks to the developers and maintainers of this API for providing a reliable and easy-to-use service.
## For Fetching Currency Lists:
- https://open.er-api.com/v6/latest/USD
- https://api.exchangerate.host/latest
- https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json

## For Currency Conversion
- https://open.er-api.com/v6/latest/
- https://api.exchangerate.host/convert
- https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/

## Fallback Mechanism
If all APIs fail, the converter uses a hardcoded set of exchange rates for 20 major currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- CHF (Swiss Franc)
- CNY (Chinese Yuan)
- INR (Indian Rupee)
- NZD (New Zealand Dollar)
- SGD (Singapore Dollar)
- HKD (Hong Kong Dollar)
- MXN (Mexican Peso)
- BRL (Brazilian Real)
- ZAR (South African Rand)
- SEK (Swedish Krona)
- NOK (Norwegian Krone)
- DKK (Danish Krone)
- PLN (Polish Zloty)
- RUB (Russian Ruble)

# 7. HOW TO RUN AND DEPLOY TO THE PROVIDED SERVERS THE APPLICATION:
## setup instructions:
### locally
1. git clone your repository
2. open the index.html file in your browser of your choice
### Deployed on servers:

1. configure the basic servers web-01 and web-02
2. move to var/www/html , then intialize as git repository ,set origina master to https://github.com/Remy-cloud/web-summative.git then pulled the poject from the repository, afterwards i sudo service nginx restart 
# Load balancer:
1. do initial installation and configurations for the load balancer
2. generate ssl certificate for domain name
3. open the project using the domain name so you can access your project. 
