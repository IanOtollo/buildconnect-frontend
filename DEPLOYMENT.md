# BuildConnect - Complete Deployment Guide

## Overview

This guide covers deploying both the backend (Django) and frontend (React) of BuildConnect.

---

## Backend Deployment (Railway)

### Prerequisites
- Railway account (railway.app)
- PostgreSQL database
- Redis instance
- AWS S3 bucket (for document storage)
- M-Pesa Daraja API credentials

### Step 1: Set Up Railway Project

1. Create new project on Railway
2. Add PostgreSQL database
3. Add Redis instance
4. Connect GitHub repository or use Railway CLI

### Step 2: Environment Variables

Set these in Railway dashboard:

```
# Django Settings
SECRET_KEY=<generate-strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=your-app.railway.app

# Database (auto-configured by Railway)
DATABASE_URL=<automatically-set>

# Redis (auto-configured by Railway)
REDIS_URL=<automatically-set>

# AWS S3
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_STORAGE_BUCKET_NAME=buildconnect-documents
AWS_S3_REGION_NAME=us-east-1

# M-Pesa
MPESA_CONSUMER_KEY=<your-consumer-key>
MPESA_CONSUMER_SECRET=<your-consumer-secret>
MPESA_SHORTCODE=<your-shortcode>
MPESA_PASSKEY=<your-passkey>
MPESA_ENVIRONMENT=production

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your-email>
EMAIL_HOST_PASSWORD=<your-password>

# SMS (Optional - Africa's Talking)
AFRICASTALKING_USERNAME=<username>
AFRICASTALKING_API_KEY=<api-key>
```

### Step 3: Deploy

```bash
# Using Railway CLI
railway up

# Or connect GitHub and push to main branch
git push origin main
```

### Step 4: Run Migrations

```bash
railway run python manage.py migrate
railway run python manage.py init_system
railway run python manage.py createsuperuser
```

---

## Frontend Deployment (Vercel)

### Step 1: Set Up Vercel Project

1. Go to vercel.com
2. Import your Git repository
3. Select the `buildconnect-frontend` directory
4. Framework preset: Create React App

### Step 2: Environment Variables

Set in Vercel dashboard:

```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

### Step 3: Deploy

Vercel will automatically deploy on push to main branch.

Manual deployment:
```bash
npm install -g vercel
cd buildconnect-frontend
vercel --prod
```

---

## AWS S3 Setup

### Step 1: Create S3 Bucket

1. Go to AWS S3 console
2. Create new bucket: `buildconnect-documents`
3. Uncheck "Block all public access"
4. Enable versioning

### Step 2: Configure CORS

Add CORS configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["https://your-frontend.vercel.app"],
        "ExposeHeaders": []
    }
]
```

### Step 3: Create IAM User

1. Go to IAM console
2. Create new user: `buildconnect-s3`
3. Attach policy: `AmazonS3FullAccess`
4. Save access keys

---

## M-Pesa Daraja API Setup

### Step 1: Apply for Production Access

1. Go to developer.safaricom.co.ke
2. Create app
3. Apply for production credentials
4. Get approval (may take a few days)

### Step 2: Configure Callback URLs

Set these URLs in Daraja dashboard:

- **STK Push Callback**: `https://your-backend.railway.app/api/payments/mpesa/callback/`
- **B2C Result URL**: `https://your-backend.railway.app/api/payments/mpesa/b2c/result/`
- **B2C Timeout URL**: `https://your-backend.railway.app/api/payments/mpesa/b2c/timeout/`

---

## Post-Deployment Checklist

### Backend
- [ ] Database migrations complete
- [ ] Admin user created
- [ ] Service categories created
- [ ] Static files collected
- [ ] Celery worker running
- [ ] Health check endpoint working
- [ ] API documentation accessible

### Frontend
- [ ] Build successful
- [ ] Environment variables set
- [ ] API connection working
- [ ] Authentication flow tested
- [ ] Routes working correctly

### Third-Party Services
- [ ] S3 bucket accessible
- [ ] M-Pesa sandbox tested
- [ ] M-Pesa production credentials configured
- [ ] Email sending working
- [ ] SMS sending working (optional)

---

## Testing in Production

### Test User Flow

1. **Client Registration**
   - Register new client account
   - Verify email received
   - Login successfully

2. **Contractor Registration**
   - Register as contractor
   - Upload documents
   - Check ML verification (should auto-verify if documents are good)

3. **Service Request**
   - Create service request
   - Receive price estimation
   - Deposit funds to wallet
   - Pay 20% deposit
   - Get contractor assigned

4. **Contractor Flow**
   - Accept assignment
   - Start work
   - Complete work
   - Receive payment

5. **Payment Flow**
   - Test M-Pesa deposit
   - Test M-Pesa withdrawal
   - Verify escrow locks/releases

---

## Monitoring & Maintenance

### Set Up Monitoring

1. **Sentry** (Error Tracking)
   ```bash
   pip install sentry-sdk
   ```
   Add to Django settings

2. **Google Analytics** (Frontend)
   Add GA tracking code to React app

3. **Railway Logs**
   Monitor application logs in Railway dashboard

### Regular Maintenance

- Check database size and optimize
- Monitor API response times
- Review ML model accuracy
- Update dependencies monthly
- Backup database weekly

---

## Scaling Considerations

### As You Grow

1. **Database**
   - Upgrade PostgreSQL plan
   - Add read replicas
   - Implement connection pooling

2. **File Storage**
   - Enable CloudFront CDN for S3
   - Implement image optimization
   - Set lifecycle policies

3. **Background Jobs**
   - Scale Celery workers
   - Add task monitoring
   - Implement task priorities

4. **Caching**
   - Implement Redis caching
   - Add CDN for static files
   - Cache API responses

---

## Troubleshooting

### Common Issues

**Backend won't start**
- Check DATABASE_URL is set
- Verify all environment variables
- Check Railway logs

**Frontend API errors**
- Verify REACT_APP_API_URL is correct
- Check CORS settings in Django
- Verify backend is running

**M-Pesa callbacks failing**
- Ensure callback URL is accessible
- Check M-Pesa credentials
- Verify webhook signature validation

**File uploads failing**
- Check S3 credentials
- Verify CORS configuration
- Check bucket permissions

---

## Support

For deployment issues:
1. Check Railway/Vercel logs
2. Review error messages
3. Verify environment variables
4. Test API endpoints manually

---

## Production URLs

After deployment, you'll have:

- **Backend API**: `https://your-app.railway.app/api`
- **Admin Panel**: `https://your-app.railway.app/admin`
- **Frontend**: `https://your-app.vercel.app`
- **API Docs**: `https://your-app.railway.app/api/docs`
