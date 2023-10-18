

# This is a server site repository 
### This site is student management site 

## Students all API list 
 
- http://host:5000/add_student   //student data save API 
- http://host:5000/students  //all student API only admin  
- http://host:5000/student/:email   // single student search API only admin  
- http://host:5000/student/:id   // student role update API only admin 
- http://host:5000/student/:id   // student data delete API only admin 


## Course all API list 
 
* http://host:5000/course   //course added API only admin  
* http://host:5000/courses   // all course show API  only admin 
* http://host:5000/course/:id   // Course update API only admin  
* http://host:5000/course/:id   // Course delete API only admin 


## Enrollment all API list  
* http://host:5000/enroll   // Enrollment create API only admin  
* http://host:5000/enroll  // show all enrollment list API only admin  
* /enroll/:id   // Delete course API only admin  
* /enroll/:title   // individually enrollment course search API only admi 