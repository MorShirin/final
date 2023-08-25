# final
# The purpose of the project and general explanation <br> </br>
A system for managing and locating flights and vacation destinations <br> </br>
# Types of users <br> </br>
There are two types of users - user and administrator
# Processes
A manager is able to enter discounts for all destinations or for a specific destination. A Manager is able to add a flight, search flights, all of them or search flights by specific destination. A Manager is able to view all the existing opinions. A Manager is able to add and delete users or admins
A manager can view a graph that organizes customer satisfaction around the destinations. A customer can receive a notification about discounts, if the discount is on a certain destination then it will lead to the relevant flight <br> </br>
A customer can search for flights, all of them or by destination. A customer can write a recommendation or an opinion and rate a destination. A customer can send an email to the system administrator. Also, if a customer wants to register on the website, then on the login screen, he can send an email to the system administrator requesting to register on the website

# Data
We organized the data schema-less to gain flexibility and an intuitive way of working. In that way we should do schema on read. We have a collection of flights that includes flight information: flight destination, place of origin, flight date, time, departure terminal and price. We have a collection of opinions that consists of the following details: name, email, destination, content of the recommendation and rating. We have a collection of customers that includes the username and password to connect to the system. We have a collection for coupons that saves the discounts with the following details: the percentage of the promotion and the destination.s

# Architecture 
The architecture includes the following three tiers: a Mongodb database server which is managed without a schema using collections to gain flexibility and an intuitive way of working. In addition, there is an application server whose role is to manage the central data which works in a nodejs environment. This work environment knows how to decode Java Script and you can develop any application with it. , in addition, the exprss package was used, which is very significant, and a display layer that includes the user interface and the html, css, and js technologies. We will use MVC format. 
![login](https://github.com/MorShirin/final/assets/135598988/3b4157a7-a4f8-4bf9-86a6-61f74e7f0a3a) 



![discount](https://github.com/MorShirin/final/assets/135598988/edfb194b-b309-4d97-843a-dc172d80cf52)





![search](https://github.com/MorShirin/final/assets/135598988/9b700da4-9636-485d-a2cf-cef7872c553c)





![graph](https://github.com/MorShirin/final/assets/135598988/cc8797e0-dbed-4d14-a876-967d7f874605)




![opinion](https://github.com/MorShirin/final/assets/135598988/ba667198-ae4c-483d-983c-191472d33bfb)
