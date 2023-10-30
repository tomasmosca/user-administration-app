# User Administration System

## Description

A fullstack user management system application. Includes: User authentication and register, public data display, full CRUD for admin users, report gathering and more.

Technologies used: Angular, Springboot, Java and PostgreSQL.

## Prerequisites

Before you clone the repo, ensure you have met the following requirements:

- Java Development Kit (JDK) Version (latest version)
- Node.js and npm
- Angular CLI: Install it globally using `npm install -g @angular/cli`
- PostgreSQL: Ensure PostgreSQL is installed and running.
- An IDE or code editor like IntelliJ IDEA, Eclipse or Visual Studio Code.

## Installation

### Backend (Spring Boot)

1. **Clone the Repository**:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```
2. **Configure the Application:**
   
   Update src/main/resources/application.properties with the correct PostgreSQL credentials and database name.

   Example application.properties:
   ```sh
    spring.datasource.url=jdbc:postgresql://localhost:5432/yourDatabaseName
    spring.datasource.username=yourPostgresUsername
    spring.datasource.password=yourPostgresPassword
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.format_sql=true
   ```
   - http://localhost:5432/ is recommended for the database.
3. **Run the Application:**

   You can run the application using your IDE or by using Maven from the command line.

   - For Maven:
     ```sh
       ./mvnw spring-boot:run
     ```
     Note: The application MUST be run at http://localhost:8080/.
### Frontend (Angular)

1. **Navigate to the Angular Project Directory: (/client directory)**
   ```sh
    cd path/to/angular/project
   ```
2. **Install Dependencies:**
   ```sh
    npm install
   ```
3. **Run the Angular Development Server:**
   ```sh
    ng serve
   ```
   The application will be available at http://localhost:4200/.


   
