# Mess Management System

This is a web-based Mess Management System designed to simplify and automate routine tasks for managing a shared mess. The system allows users to log in, manage market duty schedules, track expenses, and handle contributions transparently.



![image](https://github.com/Sahnik0/Mess-Management/blob/1b525836d1cfa784bbee3a8fee32b6ae4bb1c323/WhatsApp%20Image%202025-01-09%20at%2000.18.24_5cb46ac1.jpg)

## Features

1. **User Authentication**:
   - Users log in using their Google accounts.

2. **Market Duty Routine**:
   - Users can select two days of the week for market duty.
   - Email reminders are sent to the users on their selected days.

3. **Expense Tracking**:
   - Users record daily market expenses, including the amount and groceries purchased.
   - The system maintains a cumulative record of all expenses.

4. **Contribution Management**:
   - Users can log their monetary contributions, specifying the amount, contributor’s name, and the date.
   - The system deducts expenses from the available funds and provides an updated balance.

5. **Dynamic Dashboard**:
   - Displays a summary of contributions, expenses, and remaining balance.
   - Includes a detailed breakdown of purchases and contributions for transparency.

## Project Structure


## Setup Instructions

### Prerequisites
- Node.js (>=14.x)
- npm or yarn
- Firebase account for authentication and backend setup

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Sahnik0/Mess-Management.git
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project.
   - Enable Google Authentication.
   - Obtain the Firebase configuration and replace placeholders in `src/lib/firebase.ts`.

4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your Firebase API keys and other required configurations.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open the app in your browser at `http://localhost:3000`.

## Usage
- **Login**: Log in using a Google account.
- **Dashboard**: View a summary of contributions, expenses, and balances.
- **Market Duty**: Set market duty days and receive email reminders.
- **Expenses**: Add daily expenses and track purchases.
- **Contributions**: Record contributions and maintain transparency.

## Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Firebase Authentication and Realtime Database
- **Build Tool**: Vite

## Future Improvements
- Add notifications for pending tasks.
- Support multiple mess groups with individual management.
- Generate detailed monthly reports.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Feel free to ask for help or suggest new features!

