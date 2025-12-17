# Supreme Stamps 🎯

> **v0.1.0-beta** - E-Commerce Platform for Custom Company Stamps in UAE

A modern, full-stack e-commerce platform for ordering custom self-inking company stamps with real-time preview, secure checkout, and admin management.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)
![Tests](https://img.shields.io/badge/Tests-7%2F7%20Passing-success)

## ✨ Features

### Customer Features
- 🎨 **Real-time Stamp Configurator** - Live SVG preview with customizable shapes, colors, and text
- 🛒 **Shopping Cart** - Multi-item cart with localStorage persistence
- 📱 **Phone Validation** - International phone number support with country codes
- 📦 **Order Tracking** - Secure tracking with phone number verification
- 🚚 **Delivery Options** - Choose between delivery or pickup
- 📄 **File Upload** - Upload trade licenses (PDF, JPG, PNG)

### Admin Features
- 🔐 **TOTP Authentication** - Secure login with Google Authenticator
- 📊 **Order Management** - View and update order statuses
- 👥 **Customer Details** - Access contact information and uploaded documents
- 💬 **WhatsApp Integration** - Direct contact links for customer communication

### Technical Features
- ✅ **Comprehensive Testing** - Unit tests (Vitest) + E2E tests (Playwright)
- 🎯 **Type Safety** - Full TypeScript coverage
- 🔒 **Security** - Phone verification, TOTP auth, protected routes
- 📱 **Responsive Design** - Mobile-first approach (in progress)

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **File Upload**: UploadThing
- **Authentication**: TOTP (Google Authenticator)
- **Testing**: Vitest + Playwright
- **Animations**: Framer Motion

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- UploadThing account (for file uploads)

### Setup

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/MaharoofRashi/supreme-stamps.git
cd supreme-stamps
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your credentials:
\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/supreme_stamps"

# UploadThing
UPLOADTHING_TOKEN="your_uploadthing_token"

# Admin TOTP Secret (generate with Google Authenticator)
ADMIN_TOTP_SECRET="your_totp_secret"
\`\`\`

4. **Set up database**
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. **Run development server**
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests
\`\`\`bash
npm run test
\`\`\`

### E2E Tests
\`\`\`bash
npx playwright test
\`\`\`

### Test Coverage
- ✅ Pricing calculations (3/3 tests)
- ✅ Order creation flow (1/1 test)
- ✅ Order tracking security (3/3 tests)

**Total: 7/7 tests passing**

## 📁 Project Structure

\`\`\`
src/
├── app/
│   ├── (admin)/          # Admin dashboard (protected)
│   ├── (shop)/           # Public shop pages
│   └── api/              # API routes
├── components/
│   ├── layout/           # Header, Footer, etc.
│   └── ui/               # shadcn/ui components
├── features/
│   └── configurator/     # Stamp configurator feature
├── lib/
│   ├── cart-context.tsx  # Global cart state
│   ├── pricing.ts        # Pricing logic
│   └── prisma.ts         # Database client
└── types/                # TypeScript types
\`\`\`

## 💰 Pricing

- **Base Stamp**: 149 AED
- **Logo Add-on**: +49 AED
- **Delivery**: FREE

## 🔐 Admin Access

1. Navigate to `/admin/login`
2. Enter TOTP code from Google Authenticator
3. Access order management dashboard

## 🛣️ Roadmap

### v0.2.0 (Next Release)
- [ ] Mobile responsiveness improvements
- [ ] Email notifications (order confirmations)
- [ ] Stripe payment integration
- [ ] Enhanced admin analytics

### Future
- [ ] Customer accounts
- [ ] Order history
- [ ] Bulk ordering
- [ ] Custom stamp templates

## 📸 Screenshots

### Customer Flow
- Stamp Configurator
- Shopping Cart
- Checkout
- Order Tracking

### Admin Dashboard
- Orders Table
- Order Details
- Status Management

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the repository owner.

## 📄 License

Proprietary - All rights reserved

## 👨‍💻 Author

**Maharoof Rashi**
- GitHub: [@MaharoofRashi](https://github.com/MaharoofRashi)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ in Dubai**
