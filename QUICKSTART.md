# Quick Start Guide

## 1. Get Your Supabase Credentials

Visit [https://app.supabase.com](https://app.supabase.com) and:
- Create a new project
- Go to **Settings > API**
- Copy your **Project URL**
- Copy your **Anon (public) Key**

## 2. Configure Environment Variables

Open `.env.local` and add your credentials:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Enable Email Authentication

In your Supabase dashboard:
- Go to **Authentication > Providers**
- Find **Email**
- Click to expand and enable it
- No additional setup needed for basic email/password auth

## 4. Start Development

```bash
npm run dev
```

Visit `http://localhost:5173` and test the login!

## 5. Test Account

Create a test account:
1. Click "Sign Up"
2. Enter your email and password
3. Confirm password
4. Check your email for verification link (if email confirmations are enabled)
5. Login with your credentials

## Features to Test

✅ **Sign Up** - Create a new account  
✅ **Sign In** - Login with email/password  
✅ **Validation** - Password mismatch error  
✅ **Error Handling** - Invalid credentials message  
✅ **Responsive** - Resize browser to test mobile view  
✅ **Logout** - Sign out from dashboard  
✅ **Session Persistence** - Refresh page, stay logged in  

## Customization Ideas

🎨 **Branding**
- Change colors in Tailwind classes
- Update logo/branding in header
- Modify gradient background

🔧 **Functionality**
- Add "Forgot Password" feature
- Add social login (Google, GitHub)
- Add user profile management
- Add email verification

📱 **UI Enhancements**
- Add animations with Framer Motion
- Add dark mode toggle
- Add language localization
- Add two-factor authentication

## File Reference

| File | Purpose |
|------|---------|
| `src/components/Login.jsx` | Login/signup form |
| `src/App.jsx` | Auth state & dashboard |
| `src/services/supabaseClient.js` | Supabase setup |
| `.env.local` | Your credentials (keep secret!) |
| `tailwind.config.js` | Tailwind configuration |

## Common Issues

**Q: Form not submitting?**  
A: Check that `.env.local` has your Supabase credentials

**Q: Styles not appearing?**  
A: Run `npm run dev` to restart Vite (hot reload might need restart)

**Q: Email verification not working?**  
A: Check spam folder, or disable email confirmation in Supabase settings

**Q: CORS errors?**  
A: Ensure your Supabase URL and anon key are correct in `.env.local`

Need help? Check [LOGIN_SETUP.md](./LOGIN_SETUP.md) for detailed documentation!
