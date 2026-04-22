# Test Suite Documentation

## Overview
Comprehensive automated test suite for the HR Workflow Designer application with 10 passing tests covering validation logic and API functionality.

## Test Configuration

**Test Framework**: Vitest 4.0.15  
**Testing Library**: React Testing Library 16.3.0  
**Environment**: jsdom 27.2.0  
**Coverage**: Available via `npm run test:coverage`

## Test Structure

### 1. Workflow Validation Tests (`workflowValidation.simple.test.ts`)
Tests the core validation logic for workflow integrity and correctness.

**Test Cases (6 total):**
- ✅ `should return valid for empty workflow` - Ensures empty canvas doesn't show errors
- ✅ `should require exactly one start node` - Validates start node requirement
- ✅ `should detect multiple start nodes` - Catches duplicate start nodes
- ✅ `should warn about missing end node` - Shows warning for workflows without end
- ✅ `should detect disconnected nodes` - Identifies orphaned nodes
- ✅ `should detect cycles in workflow` - Prevents circular dependencies

### 2. Workflow API Tests (`workflowApi.simple.test.ts`)
Tests the mock API layer for automation actions.

**Test Cases (4 total):**
- ✅ `should return array of automation actions` - Verifies API returns array
- ✅ `should return automation actions with required properties` - Validates data structure
- ✅ `should include send-email automation` - Confirms send_email action exists
- ✅ `should include create-document automation` - Confirms generate_doc action exists

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Generate Coverage Report
```bash
npm run test:coverage
```

## Test Results

**Total Tests**: 10  
**Status**: ✅ All Passing  
**Execution Time**: ~2 seconds  
**Test Files**: 2  

### Summary
- ✅ 6 validation tests passing
- ✅ 4 API tests passing
- ✅ 100% test success rate
- ✅ Fast execution with efficient mocks

**Total Test Files:** 2  
**Total Tests:** 10  
**Status:** ✅ All Passing  

## Coverage Areas

### ✅ Covered
- Workflow validation logic
- Cycle detection algorithm
- Disconnected node detection
- Start/End node validation
- API mock data retrieval
- Automation action structure

### 📋 Future Enhancements
- Component testing for React components
- Hook testing for useWorkflowState and useAutomations
- Integration tests for full workflow simulation
- E2E tests for user interactions
- Performance testing for large workflows

## Test Configuration

### Vitest Config (`vitest.config.ts`)
- **Environment:** jsdom (for DOM simulation)
- **Setup File:** `src/test/setup.ts`
- **Coverage Provider:** v8
- **Coverage Reporters:** text, json, html

### Setup File (`src/test/setup.ts`)
- Extends Vitest with @testing-library/jest-dom matchers
- Auto-cleanup after each test
- Configured for React component testing

## Continuous Integration

Tests are designed to run in CI/CD pipelines:
- Fast execution (< 3 seconds total)
- No external dependencies
- Deterministic results
- Clear failure messages

## Best Practices

1. **Test Naming:** Descriptive "should..." format
2. **Isolation:** Each test is independent
3. **AAA Pattern:** Arrange, Act, Assert
4. **Mock Data:** Uses realistic HR workflow scenarios
5. **Type Safety:** Full TypeScript coverage in tests

## Adding New Tests

When adding new features, create test files following this pattern:

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../../path/to/module';

describe('Module Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = /* test data */;
    
    // Act
    const result = yourFunction(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

## Troubleshooting

### Common Issues
1. **Import Errors:** Ensure correct relative paths
2. **Type Errors:** Match actual interface definitions
3. **Async Tests:** Use `async/await` for API calls
4. **Mock Data:** Update tests when mockData.ts changes

### Debug Tips
- Use `npm run test:ui` for interactive debugging
- Add `console.log` statements in tests
- Check actual vs expected values in error messages
- Verify type definitions match implementation
