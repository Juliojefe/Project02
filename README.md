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
