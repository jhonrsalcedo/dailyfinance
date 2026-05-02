# 🏦 Daily Finance - Architecture Documentation

> Complete architecture overview of the Daily Finance application - a personal finance management system.

---

## 📊 Architecture Overview

```mermaid
graph LR
    subgraph Frontend
        A1[Next.js 15 App Router]
        A2[MUI v5 Components]
        A3[React Query]
        A4[NextAuth.js]
        A5[Recharts]
    end
    
    subgraph Backend
        B1[FastAPI Python]
        B2[SQLModel ORM]
        B3[Pydantic v2]
        B4[JWT Auth]
    end
    
    subgraph Database
        C[(SQLite_Turso)]
    end
    
    subgraph Deploy
        D1[Vercel]
        D2[Render]
    end
    
    A1 -->|HTTP JSON + JWT| B1
    A3 --> A1
    A4 --> A1
    A2 --> A1
    B1 --> B2
    B2 --> C
    B4 --> B1
    A1 --> D1
    B1 --> D2
```

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant NextAuth
    participant Backend
    participant Database

    User->>Frontend: Enters email/password
    Frontend->>Backend: POST /api/v1/auth/login
    Backend->>Database: Validate credentials
    Database-->>Backend: User data
    Backend->>Backend: Generate JWT token
    Backend-->>Frontend: JWT Token
    Frontend->>NextAuth: Store session with JWT
    NextAuth-->>Frontend: Session established
    
    Note over User,Frontend: Subsequent requests use JWT
    
    Frontend->>Backend: API Request + Bearer Token
    Backend->>Backend: Validate JWT with secret
    Backend-->>Frontend: Protected data
    
    Note over User,Frontend: Logout clears session
    
    User->>Frontend: Click Logout
    Frontend->>Frontend: Clear session
    Frontend->>User: Redirect to login
```

---

## 💳 Transaction Flow

```mermaid
flowchart TD
    A[User opens Transactions] --> B[Click Add Transaction]
    B --> C[Fill: Amount]
    C --> D[Select Category]
    D --> E[Select Payment Method]
    
    E --> F{Is Transfer?}
    F -->|Yes| G[Select Bank from list]
    G --> H[18 Colombian banks: Nequi, Daviplata, etc.]
    F -->|No| I[Continue]
    
    H --> J[Add Description]
    I --> J
    J --> K[Add Date]
    K --> L[Click Submit]
    
    L --> M[Frontend validates with Zod]
    M --> N{Valid?}
    N -->|No| O[Show validation errors]
    N -->|Yes| P[POST /api/v1/transactions]
    
    P --> Q[Backend validates JWT]
    Q --> R{Authenticated?}
    R -->|No| S[Return 401]
    R -->|Yes| T[Save to SQLite/Turso]
    
    T --> U[Update React Query cache]
    U --> V[Show success message]
    V --> W[Refresh transactions list]
    
    style G fill:#e3f2fd
    style H fill:#bbdefb
```

---

## 🛠️ Technology Stack

```mermaid
graph TD
    A[Daily Finance App] --> B[Frontend]
    A --> C[Backend]
    A --> D[Database]
    A --> E[Infrastructure]
    A --> F[Testing]
    A --> G[CI/CD]
    
    B --> B1[Next.js 15]
    B --> B2[React 18]
    B --> B3[TypeScript]
    B --> B4[MUI v5]
    B --> B5[React Query]
    B --> B6[Recharts]
    B --> B7[NextAuth.js]
    
    C --> C1[FastAPI]
    C --> C2[Python 3.13]
    C --> C3[SQLModel]
    C --> C4[Pydantic v2]
    C --> C5[JWT/Passlib]
    
    D --> D1[SQLite_Dev]
    D --> D2[Turso_libSQL_Prod]
    D --> D3[PostgreSQL_Optional]
    
    E --> E1[Vercel_Frontend]
    E --> E2[Render_Backend]
    
    F --> F1[Vitest]
    F --> F2[React Testing Library]
    F --> F3[Pytest]
    F --> F4[Playwright]
    
    G --> G1[GitHub Actions]
    G --> G2[Husky Pre-commit]
    G --> G3[ESLint]
    G --> G4[TypeScript]
    
    style B1 fill:#000000,color:#fff
    style C1 fill:#009688,color:#fff
    style D1 fill:#ff9800,color:#000
    style E1 fill:#000,color:#fff
    style F1 fill:#6c757d,color:#fff
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USER ||--o{ USER_SETTINGS : has
    USER ||--o{ TRANSACTION : creates
    CATEGORY ||--o{ TRANSACTION : categorizes
    PAYMENT_METHOD ||--o{ TRANSACTION : uses
    CATEGORY ||--o{ MONTHLY_BUDGET : budgets
    
    USER {
        int id
        string email
        string password_hash
        string username
        string created_at
        string reset_code
        string reset_code_expires
    }
    
    USER_SETTINGS {
        int id
        int user_id
        string username
        string email
        float salary
        string currency
        bool notifications_enabled
        bool onboarding_completed
        string created_at
        string updated_at
    }
    
    CATEGORY {
        int id
        string name
        string icon
        string color
    }
    
    PAYMENT_METHOD {
        int id
        string name
        string type
    }
    
    TRANSACTION {
        int id
        float amount
        string date
        string description
        int category_id
        int method_id
    }
    
    MONTHLY_BUDGET {
        int id
        string month
        int category_id
        float limit_amount
    }
```

---

## 📁 Project Structure

```mermaid
graph TD
    A[app-dailyfinance] --> B[frontend]
    A --> C[backend]
    A --> D[.github/workflows]
    
    B --> B1[app/]
    B --> B2[components/]
    B --> B3[utils/]
    B --> B4[schemas/]
    B --> B5[e2e/]
    
    B1 --> B1a[page.tsx - Dashboard]
    B1 --> B1b[transactions/page.tsx]
    B1 --> B1c[budget/page.tsx]
    B1 --> B1d[reports/page.tsx]
    B1 --> B1e[settings/page.tsx]
    B1 --> B1f[login/page.tsx]
    
    B2 --> B2a[TransactionForm.tsx]
    B2 --> B2b[DashboardBalance.tsx]
    B2 --> B2c[CategoryChart.tsx]
    B2 --> B2d[Sidebar.tsx]
    B2 --> B2e[TopBar.tsx]
    B2 --> B2f[skeletons/]
    
    C --> C1[main.py]
    C --> C2[app/]
    C --> C3[tests/]
    
    C2 --> C2a[routes/]
    C2 --> C2b[models/]
    C2 --> C2c[schemas/]
    C2 --> C2d[database.py]
    C2 --> C2e[seed.py]
    
    D --> D1[checks.yml]
    D --> D2[deploy.yml]
    
    style B1 fill:#007acc,color:#fff
    style C1 fill:#009688,color:#fff
    style B2f fill:#6c757d,color:#fff
    style C3 fill:#28a745,color:#fff
```

---

## 🚀 Deployment Flow

```mermaid
flowchart LR
    A[Git Push] --> B[GitHub]
    B --> C[CI Pipeline]
    
    C --> C1[Lint & TypeScript]
    C --> C2[Unit Tests]
    C --> C3[Build]
    C --> C4[Backend Tests]
    
    C1 --> D{Pass?}
    C2 --> D
    C3 --> D
    C4 --> D
    
    D -->|Yes| E[Deploy]
    D -->|No| F[Fail & Notify]
    
    E --> E1[Vercel: Frontend]
    E --> E2[Render: Backend]
    
    E1 --> G[Production URL]
    E2 --> G
    
    style E1 fill:#000,color:#fff
    style E2 fill:#5227ff,color:#fff
    style F fill:#dc3545,color:#fff
```

---

## 🔗 API Endpoints Summary

```mermaid
graph LR
    subgraph Auth
        A1[POST /auth/register]
        A2[POST /auth/login]
        A3[GET /auth/me]
    end
    
    subgraph Transactions
        T1[GET /transactions]
        T2[POST /transactions]
        T3[PUT /transactions/:id]
        T4[DELETE /transactions/:id]
        T5[GET /transactions/stats]
    end
    
    subgraph Categories
        C1[GET /categories]
        C2[POST /categories]
        C3[PUT /categories/:id]
        C4[DELETE /categories/:id]
    end
    
    subgraph Settings
        S1[GET /settings]
        S2[POST /settings]
        S3[GET /settings/profile]
        S4[PUT /settings/profile]
    end
    
    subgraph Budget
        B1[GET /budget]
        B2[POST /budget]
    end
    
    subgraph Stats
        R1[GET /stats/monthly]
        R2[GET /stats/by-category]
        R3[GET /stats/history]
    end
    
    style A1 fill:#28a745,color:#fff
    style A2 fill:#28a745,color:#fff
    style T2 fill:#007acc,color:#fff
    style T1 fill:#6c757d,color:#fff
```

---

## 📝 Key Implementation Details

### Authentication
- **JWT-based** using `python-jose` and `passlib`
- Tokens stored in HTTP-only cookies via NextAuth.js
- Token validation on every protected endpoint
- Optional auth endpoints return demo data

### State Management
- **Server State**: React Query (@tanstack/react-query)
- **Client State**: React hooks (useState, useEffect)
- **Auth State**: NextAuth.js session + JWT

### Form Validation
- **Frontend**: React Hook Form + Zod
- **Backend**: Pydantic v2 with strict validation

### Testing Strategy
- **Unit Tests**: Vitest (frontend), Pytest (backend)
- **E2E Tests**: Playwright
- **Coverage**: Minimum 80% on critical paths

### Performance Optimizations
- Next.js App Router with Server Components
- React Query caching and deduplication
- SQLite with proper indexing
- Debounced search inputs

---

## 🎯 Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| User Authentication | ✅ | Register, Login, JWT |
| Dashboard | ✅ | Stats, charts, recent transactions |
| Transactions CRUD | ✅ | Create, Read, Update, Delete |
| Transferencias | ✅ | 18 Colombian banks integration |
| Budget | ✅ | Monthly budget per category |
| Reports | ✅ | Monthly and category statistics |
| Settings | ✅ | User profile, salary, currency |
| Skeleton Loaders | ✅ | Loading states for all pages |
| Unit Tests | ✅ | 40+ tests (Vitest + Pytest) |
| E2E Tests | ✅ | 11 Playwright tests |
| CI/CD | ✅ | GitHub Actions + Husky |

---

## 📚 Learning Resources Used

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MUI v5 Documentation](https://mui.com/)
- [React Query Documentation](https://tanstack.com/query)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Mermaid.js Diagrams](https://mermaid.js.org/)

---

## 🤝 Contributing

Feel free to submit PRs or open issues to improve this architecture documentation or the application itself.

---

## 📄 License

MIT License - See LICENSE file for details.

---

*This architecture documentation was created to demonstrate Fullstack implementation skills using modern technologies.*