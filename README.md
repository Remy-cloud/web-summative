1.**Introduction**

The **Real-Time Currency Converter** is a highly valuable tool for society as it solves the problem of constantly fluctuating currency exchange rates. In a globalized world, businesses, travelers, and individuals need to quickly and accurately convert currencies for transactions, investments, or travel purposes. This application ensures that users have up-to-date exchange rates, helping them make informed financial decisions, reduce the risk of financial losses due to outdated data, and plan their spending more effectively.

The tool simplifies the process of currency conversion, making it accessible to anyone with an internet connection, and it plays a key role in facilitating international trade, tourism, and personal financial planning.


This guide walks us through the deployment of the Real-Time Currency Converter application on two web servers and the configuration of HAProxy as a load balancer to distribute traffic between the servers. The application is a Flask-based web service that allows users to convert between different currencies in real time.

We will do the following:

Deploy the Flask application on two web servers.

Set up HAProxy on a third server to balance traffic between the web servers.

Test the application and load balancing to ensure traffic is distributed evenly and the application remains accessible.

2.**Prerequisites**

Before starting, we should ensure that we have the following:

Two Ubuntu web servers (Web01 and Web02).

One Ubuntu load balancer server (lb-01).

SSH access to all servers.

The Flask application ready for deployment.

HAProxy installed on the load balancer (lb-01).

Basic understanding of Flask, HAProxy, and Linux server management.

3.**Deployment Steps**

I.Deploying Flask Application to Web Servers
The Flask application is deployed on two web servers to ensure redundancy.
II.Installing and Configuring HAProxy for Load Balancing
The load balancer will ensure that traffic is evenly distributed between the two web servers. We will install and configure HAProxy on the load balancer server (lb-01).

4.**Testing**

I.Testing the Application
After deploying the application and setting up the load balancer, you can test the Real-Time Currency Converter by accessing the load balancer’s IP address in a web browser:
II.Testing Load Balancing
To verify that HAProxy is properly balancing traffic between the two web servers

5.**Troubleshooting**

If you encounter issues, here are some troubleshooting steps:

I.Flask Application Not Responding:

Ensure that Flask is running on both Web01 and Web02.

Verify that the correct IP and port (5000) are being used.

HAProxy Issues
Check HAProxy’s status
Check the HAProxy logs for errors

II.Firewall

Ensure that HTTP (port 80) and Flask (port 5000) are open on both web servers and the load balancer.

