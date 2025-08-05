# Fitness-Tracking-App

## Features
1. User Authentication (signup, login, logout)
2. Profile Management (View and update the personal information)
3. Add Workout(exercise type, duration, calories burned and date), 
4. Update and Delete workouts
5. Read the history of workouts (sort in date)
6. Set Goals 
    - number of workouts per week
    - Specific weight goal
7. Track Progress and visualization using charts
8. Notify users when they are close to achieving their goals or when they have met a goal.

## Tech Stack
### Frontend
- React.JS
- Tailwind CSS
- Redux Toolkit
- Chart.JS
- Axios
### Backend
- Node.JS
- Express.JS
- MongoDB (mongoose)
- JWT
- Bcrypt.JS (password hashing)

## Folder Structure
- Client
- Server

## How to run the app?

## APIs
- api/v1/users/register    - POST    (Register a user)   
- api/v1/users/login       - POST    (login an existing user)
- api/v1/users/profile     - GET     (get user's profile)
- api/v1/users/logout               (logout a user)
- api/v1/workouts/         - POST    (create a new workout)
- api/v1/workouts/         - GET     (get all workouts for a user)
- api/v1/workouts/:id      - GET     (get a specific workout)
- api/v1/workouts/:id      - PUT     (update a specific workout)
- api/v1/workouts/:id      - DELETE  (delete a specific workout)
- api/v1/goals             - POST    (create a new goal)
- api/v1/goals             - GET     (get all goals for a user)

## MongoDB Collections
1. Users
    - email
    - password
    - firstname
    - lastname
    - dob
    - gender (male, female, other)
    - height
    - weight
    - profilePicture
    - level (beginner, intermediate, advanced)
2. Workouts
    - type (cardio, strength, flexibility, yoga, etc)
    - userId (Ref to Users)
    - duration
    - caloriesBurned
    - date
3. Goals
    - userId (Ref to Users)
    - type (weight loss, gain)
    - targetValue (number value for loss/gain)
    - currentValue
    - unit (kg, lbs)
    - startDate
    - endDate
    - isAchieved