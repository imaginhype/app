# Marketplace Pro - Complete Deployment Guide

## 📁 Files You Should Have

Make sure you have ALL 7 files in ONE folder:

- [x] `index.html`
- [x] `admin-dashboard.html`
- [x] `seller-dashboard.html`
- [x] `style.css`
- [x] `app.js`
- [x] `firebase-config.js` (or config replaced directly in HTML files)
- [x] `README.md` (this file)

---

## 🚀 Step-by-Step Deployment (30 minutes)

### Part 1: Firebase Setup (Already Done?)

If you already created Firebase project and copied config values, skip to Part 2.

**Quick Firebase Setup:**

1. Go to https://console.firebase.google.com/
2. Sign in with `Imaginhype@gmail.com`
3. Click "Create Project" → Name: `MarketplacePro`
4. Turn OFF Google Analytics → Click "Create"
5. Click Web icon `</>` → Nickname: `marketplace-app`
6. Copy the `firebaseConfig` object values
7. Enable Authentication: Go to "Authentication" → "Get Started" → Enable "Email/Password"
8. Create Database: Go to "Firestore Database" → "Create Database" → Start in "Test Mode"
9. Update Security Rules (Firestore → Rules tab):
