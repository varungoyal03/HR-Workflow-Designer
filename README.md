# HR Workflow Designer

A powerful, visual workflow designer built with React and React Flow for creating and testing HR automation workflows. Design complex approval flows, task assignments, and automated actions with an intuitive drag-and-drop interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Security](https://img.shields.io/badge/security-9.3%2F10-success)

## ✨ Key Features

### 🎨 Visual Workflow Builder
- **Drag-and-Drop Interface**: Intuitive canvas powered by React Flow
- **5 Specialized Node Types**:
  - 🟢 **Start Node**: Workflow entry point with metadata configuration
  - 🔵 **Task Node**: Human task assignments with assignees and due dates
  - 🟠 **Approval Node**: Manager/HR approval steps with role-based routing
  - 🟣 **Automation Node**: System-triggered actions (emails, documents, system updates)
  - 🔴 **End Node**: Workflow completion with summary messages

### 🔧 Advanced Capabilities
- **Dynamic Configuration Forms**: Each node type has custom edit panels with validation
- **Real-time Validation**: 
  - Cycle detection (prevents infinite loops)
  - Disconnected node detection
  - Start/End node validation
  - Edge connectivity checks
- **Workflow Simulation**: Step-by-step execution preview with timing and status
- **Summary Report Generation**: Comprehensive execution reports with downloadable text files
- **Undo/Redo System**: 
  - Automatic history tracking (50 state limit)
  - Keyboard shortcuts (Ctrl+Z / Ctrl+Y)
  - Smart change detection
- **Auto-Layout Algorithm**: 
  - BFS-based graph traversal
  - Smooth 600ms animations with cubic-bezier easing
  - Automatic centering and spacing
- **Export/Import with Security**: 
  - Custom modal for filename entry
  - File size validation (5MB limit)
  - Workflow size limits (1000 nodes, 2000 edges)
  - JSON structure validation
- **Mock API Integration**: 8 pre-configured automation actions
- **Interactive Mini-map**: Navigate large workflows with zoom and pan controls
- **Modern UI/UX**: 
  - Color-coded sidebar icons matching node types
  - Gradient backgrounds and smooth animations
  - Responsive design
  - Edge colors matching source node types

### 🧪 Testing Suite
- **Automated Tests**: 10+ comprehensive test cases
- **Validation Testing**: Cycle detection, node validation, edge cases
- **API Testing**: Mock data retrieval and workflow simulation
- **Security Testing**: Input validation, file size checks
- **Test UI**: Interactive test runner with coverage reports
- **Zero vulnerabilities**: npm audit clean

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hr-workflow

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port)

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t hr-workflow .
docker run -p 3000:80 hr-workflow
```

The application will be available at `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests in watch mode
npm run test:ui      # Open interactive test UI
npm run test:coverage # Generate coverage report
```

## 📖 Usage Guide

### Creating Your First Workflow

1. **Add Nodes**: 
   - Drag nodes from the left sidebar onto the canvas
   - Each node type has a distinct color and icon

2. **Connect Nodes**: 
   - Click and drag from a node's bottom handle
   - Connect to another node's top handle
   - Connections are animated and can be deleted

3. **Configure Nodes**: 
   - Click any node to open its configuration panel
   - Fill in required fields (marked with validation)
   - Changes are saved automatically

4. **Validate Workflow**: 
   - Check the top-right corner for validation status
   - Click the validation badge to see detailed errors/warnings
   - Fix issues before testing

5. **Test Workflow**: 
   - Click "Test Workflow" button
   - View step-by-step execution simulation
   - See timing, status, and details for each step

6. **Export Workflow**: 
   - Click "Export" to download as JSON
   - Share or version control your workflow
   - Import later for modifications

### Example Workflows

**Employee Onboarding:**
```
Start → Task (HR Setup) → Approval (Manager) → Automation (Send Welcome Email) → End
```

**Leave Request:**
```
Start → Task (Submit Request) → Approval (Manager) → Automation (Update Calendar) → End
```

**Document Verification:**
```
Start → Task (Upload Docs) → Approval (HR Review) → Automation (Archive) → End
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript 5
- **UI Library**: React Flow (@xyflow/react v12)
- **Icons**: Lucide React
- **Build Tool**: Vite 7
- **Testing**: Vitest 4 + React Testing Library
- **Styling**: CSS with modern gradients and animations

### Project Structure
```
src/
├── api/                    # Mock API layer
│   ├── mockData.ts        # 8 automation actions
│   ├── workflowApi.ts     # API functions with summary reports
│   └── __tests__/         # API tests
├── components/
│   ├── canvas/            # Main workflow canvas
│   ├── nodes/             # Custom node rendering (memo-wrapped)
│   ├── panels/            # Edit and simulation panels
│   ├── sidebar/           # Node palette with colored icons
│   └── modals/            # Export modal
├── hooks/                 # Custom React hooks
│   ├── useWorkflowState.ts  # State with auto history
│   └── useAutomations.ts
├── types/                 # TypeScript definitions
│   ├── workflow.types.ts
│   └── api.types.ts
├── utils/                 # Validation & security
│   ├── workflowValidation.ts
│   └── security.ts        # Input sanitization
└── test/                  # Test configuration
```

### Key Design Patterns
- **Custom Hooks**: Encapsulated state management with automatic history
- **Discriminated Unions**: Type-safe node data
- **BFS Algorithm**: Graph traversal for auto-layout
- **DFS Algorithm**: Cycle detection in validation
- **Mock API**: Realistic async operations with delays
- **Component Composition**: Modular, reusable components
- **React.memo**: Performance optimization for nodes
- **useCallback/useMemo**: Stable references and memoization
- **RequestAnimationFrame**: Smooth animations without CSS issues

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Interactive test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- ✅ Workflow validation (6 tests)
- ✅ API functionality (4 tests)
- ✅ Cycle detection
- ✅ Node validation rules
- ✅ Mock data structure

See [TESTING.md](./TESTING.md) for detailed test documentation.

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions
- **[COMPONENT_DIAGRAM.md](./COMPONENT_DIAGRAM.md)** - Component hierarchy and data flow
- **[TESTING.md](./TESTING.md)** - Test suite documentation
- **[SECURITY.md](./SECURITY.md)** - Security audit report and best practices
- **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - Detailed usage examples
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference guide
- **[WORKFLOW_TEMPLATES_GUIDE.md](./WORKFLOW_TEMPLATES_GUIDE.md)** - Pre-built workflow templates

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds and smooth shadows
- **Color-Coded Everything**: 
  - Node types: Green (start), Blue (task), Orange (approval), Purple (automated), Red (end)
  - Sidebar icons match node colors
  - Edge colors match source node types
- **Smooth Animations**: 
  - 600ms auto-layout transitions with cubic-bezier easing
  - Edges follow nodes perfectly during animation
  - Modal fade-in and slide-up effects
- **Responsive Layout**: Works on different screen sizes
- **Hover States**: Interactive feedback on all elements
- **Metrics Badges**: Visual indicators for node complexity and features
- **Validation Feedback**: Clear error and warning messages with click-to-fix
- **Mini-map Navigation**: Quick canvas overview with pan and zoom
- **Custom Modals**: Professional export dialog with validation
- **3 Pre-built Workflow Templates**: Employee Onboarding, Expense Approval, Leave Request
- **📊 Summary Badge**: Visual indicator on end nodes when report generation is enabled

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- Built with [React Flow](https://reactflow.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Vite](https://vitejs.dev/)

---

**Built with ❤️ for HR teams to automate their workflows**
