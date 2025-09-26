# Database Parser - Bank Transactions Viewer

A mobile-style bank transactions viewer that imports data from Excel (.xlsx) files.

## 🚀 Features

- **Excel Import**: Import transactions from .xlsx files with automatic header mapping
- **Mobile UI**: Mobile-first design with a banking app look and feel
- **Smart Filtering**: Search by merchant/purchase, date range, and amount filters
- **Ukrainian Support**: Full Ukrainian language support and currency formatting
- **Export**: Export filtered transactions to CSV format
- **Real-time Validation**: Shows parsing errors and validation warnings

## 🛠 Tech Stack

- **React 18+** with TypeScript
- **Vite** for build tooling
- **styled-components** for styling
- **antd-mobile** for mobile components
- **SheetJS (xlsx)** for Excel parsing
- **date-fns** for date formatting
- **Vitest + React Testing Library** for testing

## 📋 Excel File Format

The application expects an Excel file (.xlsx) with the following columns (case-insensitive, any order):

### Required Columns:

- **Date** (Дата) - Date of transaction
- **Time** (Час) - Time of transaction (optional)
- **Store** (Магазин) - Store/merchant name
- **Purchase** (Покупка) - Purchase description
- **Cost** (Вартість/Сума) - Transaction amount

### Supported Header Variations:

- Store: `Store`, `Shop`, `Merchant`, `Магазин`
- Cost: `Cost`, `Amount`, `Price`, `Sum`, `Вартість`, `Сума`
- Date: `Date`, `Дата`
- Time: `Time`, `Час`
- Purchase: `Purchase`, `Покупка`

### Sample Excel Data:

```
Date        | Time  | Store     | Purchase      | Cost
2023-12-01  | 10:30 | АТБ       | Продукти      | -150.50
2023-12-01  | 15:00 | Сільпо    | Хліб          | -25.00
2023-12-02  | 09:00 | Банкомат  | Зняття        | -200.00
2023-12-02  | 16:30 | Зарплата  | Зарплата      | 15000.00
```

## 🏃‍♂️ Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Run tests:**

   ```bash
   npm run test
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Format code:**
   ```bash
   npm run format
   ```

## 📱 Usage

1. **Import Excel File**: Click "📊 Імпортувати Excel файл" and select your .xlsx file
2. **View Transactions**: Browse transactions grouped by date in a mobile banking style
3. **Filter Data**: Use the search box and filters to find specific transactions
4. **Export Results**: Click the 💾 button to export filtered data to CSV

## 🧪 Testing

The project includes comprehensive tests covering:

- ✅ Excel parsing and header mapping
- ✅ Transaction validation and normalization
- ✅ Filtering and sorting functionality
- ✅ Component rendering

Run tests with:

```bash
npm run test        # Watch mode
npm run test:run    # Run once
npm run test:ui     # Visual test runner
```

## 📄 File Structure

```
src/
├── components/
│   └── styled.ts           # Styled components for UI
├── types/
│   └── index.ts           # TypeScript type definitions
├── utils/
│   ├── excelParser.ts     # Excel parsing and validation logic
│   └── transactionUtils.ts # Transaction filtering and formatting
├── test/
│   ├── setup.ts           # Test configuration
│   ├── *.test.ts          # Test files
└── App.tsx                # Main application component
```

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Key Features Implementation

### Excel Parsing

- Automatic header detection and mapping for multiple languages
- Support for Excel date serial numbers and various date formats
- Currency parsing with comma/dot decimal support
- Robust error handling with detailed validation messages

### Mobile Banking UI

- Sticky header with balance summary
- Grouped transaction lists by date
- Touch-friendly controls and responsive design
- Ukrainian date formatting ("Сьогодні", "Учора", etc.)

### Data Processing

- Real-time filtering and searching
- Sorting by date (newest/oldest first)
- Amount range filtering

### Error Handling

- Friendly toast notifications for all user actions
- Comprehensive validation with warnings and errors
- Graceful handling of malformed Excel files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `npm run test` and `npm run lint`
6. Submit a pull request

## 📜 License

MIT License - feel free to use this project for personal or commercial purposes.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
