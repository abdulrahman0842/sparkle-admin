# SL Admin - Login Page with Supabase & Tailwind CSS

A modern, responsive login page built with React, Vite, Tailwind CSS, and Supabase authentication.

## Features

✨ **Authentication**
- Email/Password Sign In
- Email/Password Sign Up
- Password confirmation validation
- Supabase session management
- Protected dashboard after login

🎨 **UI/UX**
- Modern gradient design
- Fully responsive (mobile, tablet, desktop)
- Tailwind CSS styling
- Loading states and error handling
- Success messages
- Smooth transitions and animations

🔒 **Security**
- Server-side authentication via Supabase
- Secure password handling
- Session persistence
- Logout functionality

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier available at https://app.supabase.com)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at https://app.supabase.com
   - Copy your project URL and anon key from Settings > API

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key_here
     ```

4. **Enable Email Authentication in Supabase:**
   - Go to Authentication > Providers
   - Enable "Email" provider
   - Configure email templates if needed

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
sladmin/
├── src/
│   ├── components/
│   │   └── Login.jsx          # Login/Sign-up component
│   ├── services/
│   │   └── supabaseClient.js  # Supabase configuration
│   ├── App.jsx                # Main app with auth management
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind directives
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables (create this)
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Components

### Login Component
Located at `src/components/Login.jsx`

Features:
- Toggle between Sign In and Sign Up modes
- Email validation
- Password matching (for sign-up)
- Error and success messages
- Loading states
- Responsive form layout

Props:
- `onAuthSuccess`: Callback function when user successfully authenticates

## Features Breakdown

### Authentication Flow
1. User lands on login page (if not authenticated)
2. User enters email and password
3. Supabase validates credentials
4. Session is created and stored
5. User is redirected to dashboard
6. On logout, session is cleared

### Responsive Design
- **Mobile (< 640px)**: Single column, optimized spacing
- **Tablet (640px - 1024px)**: Slightly larger components
- **Desktop (> 1024px)**: Full width with centered content

### Error Handling
- Invalid credentials
- Password mismatch (sign-up)
- Network errors
- User-friendly error messages

## Customization

### Change Color Scheme
Edit `tailwind.config.js` to modify the theme colors.

### Modify Form Fields
Edit `src/components/Login.jsx` to add or remove form fields.

### Update Dashboard
Modify `src/App.jsx` to customize the post-login dashboard.

## Troubleshooting

### "No session" error
- Ensure `.env.local` has correct Supabase URL and anon key
- Verify Supabase Email provider is enabled

### CSS not loading
- Ensure Tailwind directives are in `src/index.css`
- Check `tailwind.config.js` content paths

### CORS errors
- Enable Row Level Security (RLS) in Supabase if needed
- Check your Supabase project settings

## Security Notes

⚠️ **Never commit `.env.local` to version control**
- Add `.env.local` to `.gitignore`
- Always use `.env.example` as a template

✅ **Best Practices**
- Keep Supabase anon key secure
- Use RLS policies for database access
- Implement rate limiting in production
- Add email verification if needed

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT

## Next Steps

1. Set up your Supabase project
2. Add your credentials to `.env.local`
3. Run `npm run dev`
4. Test the login/signup flow
5. Customize the dashboard as needed

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
