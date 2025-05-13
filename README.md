# Looking Glass - Real-time Video Chat

A modern, real-time video chat application built with Next.js, WebRTC, and PostgreSQL.

## Features

- Real-time video and audio communication
- Text chat with message history
- Room-based communication
- Modern, responsive UI
- Secure WebRTC connections

## Prerequisites

- Node.js 18 or later
- PostgreSQL database
- DigitalOcean account (for deployment)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lookingglass

# WebRTC
ICE_SERVER_URL=your_turn_server_url

# Environment
NODE_ENV=development
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   # Create the database
   createdb lookingglass

   # Initialize the database tables
   npm run init-db
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses a simple PostgreSQL schema with two main tables:

### Rooms Table
```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  room_id TEXT REFERENCES rooms(id),
  content TEXT NOT NULL,
  sender TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment to DigitalOcean

1. Create a DigitalOcean account if you haven't already.

2. Create a new PostgreSQL database:
   - Go to Databases in your DigitalOcean dashboard
   - Create a new database cluster
   - Note down the connection details

3. Deploy the application:
   - Push your code to GitHub
   - Create a new app in DigitalOcean App Platform
   - Connect your GitHub repository
   - Set the environment variables:
     - `DATABASE_URL`
     - `ICE_SERVER_URL`
     - `NODE_ENV=production`

4. The application will be automatically deployed and available at your DigitalOcean app URL.

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure the database is running and accessible
- Check database user permissions

### WebRTC Issues
- Verify your TURN server is working
- Check browser console for WebRTC errors
- Ensure you're using HTTPS in production

### Deployment Issues
- Check DigitalOcean App Platform logs
- Verify environment variables are set correctly
- Ensure all dependencies are in package.json

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [WebRTC](https://webrtc.org/)
- [DigitalOcean](https://www.digitalocean.com/)
