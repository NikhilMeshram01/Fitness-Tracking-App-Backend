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

## Tech Stack

- Node.JS
- Express.JS
- Typescript
- MongoDB (mongoose)
- JWT
- zod
- Bcrypt.JS (password hashing)

## How to Run the App

1. Clone the repo:
   ```bash
   git clone https://github.com/NikhilMeshram01/Fitness-Tracking-App-Backend.git
   cd Fitness-Tracking-App-Backend
   ```
2. ```
   npm install

   ```

3. ```
   npm run build

   ```

4. ```
   npm start

   ```

## APIs

- api/v1/users/register - POST (Register a user)
- api/v1/users/login - POST (login an existing user)
- api/v1/users/profile - GET (get user's profile)
- api/v1/users/logout - POST (logout a user)
- api/v1/users/update - PUT (update a user profile)
- api/v1/users/refresh-token - POST (refresh the token)
- api/v1/workouts/ - POST (create a new workout)
- api/v1/workouts/ - GET (get all workouts for a user - pagination)
- api/v1/workouts/:id - GET (get a specific workout)
- api/v1/workouts/last30days - GET (get last 30 days workouts)
- api/v1/workouts/:id - PUT (update a specific workout)
- api/v1/workouts/:id - DELETE (delete a specific workout)
- api/v1/goals - POST (create a new goal)
- api/v1/goals - GET (get all goals for a user)
- api/v1/goals/update - PUT (update a specific goal)
- api/v1/goals/:id - PATCH (mark a goal completed)
- api/v1/goals/:id - DELETE (delete goal)

## MongoDB Collections

1. Users
   - \_id
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
   - refreshToken
   - createdAt
   - updatedAt
2. Workouts
   - \_id
   - exerciseType (cardio, strength, flexibility, yoga, sports, others)
   - userId (Ref to Users)
   - duration
   - caloriesBurned
   - workoutDate
   - name
   - createdAt
   - updatedAt
3. Goals
   - \_id
   - userId (Ref to Users)
   - goalType (weight loss, gain, calories, distance)
   - title
   - description
   - targetValue
   - currentValue
   - unit (kg, lbs, km, calories, workouts/week)
   - targetDate
   - isCompleted
   - createdAt
   - updatedAt

```

```
