# WebTrust - Website Reputation Analyzer

WebTrust is a comprehensive website reputation analyzer that helps users identify potentially unsafe websites before sharing personal information or making online purchases. The application combines technical domain analysis with community reviews to generate accurate trust scores for any website.

![WebTrust Screenshot](./screenshot.png)

## Features

- **Comprehensive Website Analysis**: Checks domain age, SSL certificates, hosting details, and more to verify website legitimacy.
- **Detailed Reports**: Clear, easy-to-understand reports highlighting potential risks and safety indicators.
- **Community Reviews**: User-powered reviews and ratings to supplement technical analysis.
- **Educational Blog**: Articles on online safety, scam prevention, and digital security best practices.
- **Mobile-Responsive Design**: Fully accessible on all devices, from desktop to mobile.

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with Passport.js
- **Deployment**: Easily deployable to any hosting platform

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/webtrust.git
   cd webtrust
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a .env file in the root directory with the following:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/webtrust
   ```

4. Initialize the database
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
