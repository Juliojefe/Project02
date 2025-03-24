# 🔥 Hot Takes 🔥

Hot takes is a full-stack app where users can create, customize, and submit tier lists based on different subjects. It features drag-and-drop rankings, secure authentication, and similarity-based comparisons.

## 🚀 Features

- **User Authentication:** Register, login, and Google OAuth support
- **Tier List Creation:** Create ranked lists for subjects (e.g., "American Muscle Cars")
- **Drag-and-Drop Ranking:** Assign items to S–F tiers interactively
- **Similarity Engine:** Get recommended tier lists based on yours
- **Admin Tools:** User management, subject scheduling
- **Database Persistence:** All data saved in MariaDB (via JawsDB)
- **Clean UI:** Built with React Native + Expo

## 🛠 Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Spring Boot (Java)
- **Database:** MariaDB (JawsDB)
- **Authentication:** Google OAuth2
- **Storage:** MySQL (JawsDB on Heroku)
- **Similarity Matching:** OpenAI Embeddings + cosine distance
- **Testing:** Curl

## 🎯 Introduction

Our team collaborated effectively to create an interactive tier-list application, featuring secure user authentication, intuitive UI, and reliable backend management. Through coordinated frontend and backend development, we successfully implemented core functionality such as Oauth integration, user account management, and more.

## 👥 Team Retrospective
---
### [Jayson Basilio](https://github.com/JaysonB4)

- [Pull Requests](https://github.com/Juliojefe/Project02/issues?q=state%3Aclosed%20is%3Apr%20author%3AJaysonB4)
- [Issues Resolved](https://github.com/Juliojefe/Project02/issues?q=is%3Aissue%20state%3Aclosed%20assignee%3AJaysonB4)

I worked mainly on connecting the backend of Spring Boot for the user to the frontend of our React Native web application.

**What was your role / which stories did you work on**
- Worked primarily on the frontend
- Added functionality to sign up, log in, delete own account, and the majority of admin features using API endpoints
  
**How much time was spent working outside of class**
- My time ranged from not that much to a good amount of time spent as we progressed.
  
**What was the biggest challenge?** 
- My challenge was more about motivation to work on the project since it seemed like a repeat of the last project.
  
**Why was it a challenge?**
- The last project for me wasn’t as perfect as I wanted it to be and running it back by creating a new similar project seemed unrewarding.
  
**How was it addressed?**
- I overcame the problem by mixing in other parts of the project with the backend and the endpoints. I also added stuff that I wasn’t able to include in the previous project.
  
**Favorite / most interesting part of this project**
- My favorite part was connecting the API endpoints as my teammates made it easy and accessible to work on.
  
**If you could do it over, what would you change?**
- Probably our planning since we didn’t have a definitive plan/approach from the start.
  
**What is the most valuable thing you learned?**
- For me, it was learning about the API endpoints as they get easy to use once you know your way around it.
  
---
### [Julio Fernandez](https://github.com/Juliojefe)

- [Pull Requests](https://github.com/Juliojefe/Project02/issues?q=state%3Aclosed%20is%3Apr%20author%3AJuliojefe)
- [Issues Resolved](https://github.com/Juliojefe/Project02/issues?q=is%3Aissue%20state%3Aclosed%20assignee%3AJuliojefe)

I did full stack work.

**What was your role / which stories did you work on**
- I worked on parts of the database design. Specifically I worked on the subject table and all others that had a relationship with it. 
- I developed services, controllers, DTOs, and components that allowed users to create weekly subjects. Using SerpAPI, I generated six tier items per subject for each of the three weekly subjects. 
- I created the login and sign up pages
- I created the tier list page.
  
**How much time was spent working outside of class**
- I’d say about 8 hours per week on average.
  
**What was the biggest challenge?** 
- I would say learning spring boot.
  
**Why was it a challenge?**
- Sometimes it would not build and the error messages it gave made no sense. I would say though that when it build it was quite pleasant to work with.
  
**How was it addressed?**
- I found that chatgpt could interpret the error messages quite well.
  
**Favorite / most interesting part of this project**
- Creating api endpoints in the backend and integrating them in the tier list view on our frontend.
  
**If you could do it over, what would you change?**
- I’d look into ways to simplify the database design.
  
**What is the most valuable thing you learned?**
- The most valuable thing I learned was how to work with a separated front-end and back-end architecture. Using React Native for the front-end and Spring Boot for the back-end was a great learning experience.
  
---
### [Ozzie Munoz](https://github.com/OzzieMunoz)

- [Pull Requests](https://github.com/Juliojefe/Project02/issues?q=state%3Aclosed%20is%3Apr%20author%3AOzzieMunoz)
- [Issues Resolved](https://github.com/Juliojefe/Project02/issues?q=is%3Aissue%20state%3Aclosed%20assignee%3AOzzieMunoz)

I focused on creating a secure, production‑ready Spring Boot service that handles user authentication, tier‑list management, and machine learning.

**What was your role / which stories did you work on**
- Implemented backend databases, security, and authentication. 
- Implemented frontend similarity matching using Machine Learning.
  
**How much time was spent working outside of class**
- I spent ~5 hours each week outside of class writing/testing code.
  
**What was the biggest challenge?** 
- Implementing BCrypt was tricky because I encountered a double hashing issue that made the user authentication unreliable.
  
**Why was it a challenge?**
- BCrypt was hashing passwords twice which meant stored passwords didn’t match user input and login consistently failed.
  
**How was it addressed?**
- Lots of console logs. Until I found the culprit.
  
**Favorite / most interesting part of this project**
- My favorite part was learning curl and populating data without having to wait for it to be implemented in the front end.
  
**If you could do it over, what would you change?**
- I would make a diagram early on to streamline planning later in development.
  
**What is the most valuable thing you learned?**
- The whole project was a valuable learning experience. I pushed myself out of my comfort zone by diving into backend development and emerged with new skills.
  
---
### [Ahmed Torki](https://github.com/AhmedTurkiii)

- [Pull Requests](https://github.com/Juliojefe/Project02/issues?q=state%3Aclosed%20is%3Apr%20author%3AAhmedTurkiii)
- [Issues Resolved](https://github.com/Juliojefe/Project02/issues?q=is%3Aissue%20state%3Aclosed%20assignee%3AAhmedTurkiii)

My role was initially to design the database and help understand the overall picture of the app, then configuring Heroko to Design the API endpoints. then things went very smoothly as my teammate did an amazing job, so I was only left to perform Unit tests and end-to-end testing.

**What was your role / which stories did you work on**
-  Designed the database and connected JawsDB to mySQL workbench.
- Implemented API endpoints for the front-end team to manipulate our app data.
- Implemented the front-end and back-end for updating user info using PATCH.
- Implemented Unit tests for frontend and backend.
- Implemented UI automated test using a popular test automation framework.
  
**How much time was spent working outside of class**
- 4 hours outside of class time
  
**What was the biggest challenge?** 
- One of the challenges was to understand the basic idea behind the tire list (bussines logic) and how to connect our backend with the frontend, but the biggest challenge is to learn one of the popular test automation frameworks other than selenium to test the UI on presentation day using an automated test.
  
**Why was it a challenge?**
- The time wasn’t on my side, as i need to learn and implement the test on our app.
  
**How was it addressed?**
- Mainly time management and prioritizing the important work flow of the app to test, then, if time permits, testing all the possible scenarios.
  
**Favorite / most interesting part of this project**
- Participating with new teammates who have different areas of expertise.
  
**If you could do it over, what would you change?**
- Plan the project more efficiently and participate more on the front end
  
**What is the most valuable thing you learned?**
- Discussing different points of view with other team members and agreeing to disagree and commit.
  
---

## 📥 Installation & Setup

## 🔁 Clone the Repository

<pre>git clone https://github.com/Juliojefe/Project02.git
cd Project02 </pre>

## 🔐 Set Environment Variables

<pre># Database Configuration
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection pool settings
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.max-lifetime=1800000

# JPA settings
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Google OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=profile,email

# SerpApi Key
serpapi.key=${SERPAPI_KEY}

# OpenAPI Key
openai.api.key=${OPENAI_API_KEY} </pre>

## ⚙️ Backend Setup

<pre>cd .\backend\
  ./gradlew clean build
  ./gradlew bootRun </pre>
  
## ⚙️ Frontend Setup

<pre>cd .\frontend\TierList\
  npm install
  npx expo start </pre>
