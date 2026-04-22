# HR Workflow Designer - Usage Examples

## Example 1: Employee Onboarding Workflow

### Workflow Structure
```
Start → Task (Collect Documents) → Approval (HR Manager) → Automated (Send Welcome Email) → Task (IT Setup) → End
```

### Node Configuration

**1. Start Node**
- Title: "New Employee Onboarding"
- Metadata:
  - Department: "Engineering"
  - Employee Type: "Full-time"

**2. Task Node: Collect Documents**
- Title: "Collect Required Documents"
- Description: "Gather all necessary paperwork from new employee"
- Assignee: "HR Coordinator"
- Due Date: 3 days from start
- Custom Fields:
  - Documents: "ID, Tax Forms, Bank Details"
  - Priority: "High"

**3. Approval Node: HR Review**
- Title: "Document Review and Approval"
- Approver Role: "HRBP"
- Auto-approve Threshold: 0 (manual review required)

**4. Automated Node: Welcome Email**
- Title: "Send Welcome Package"
- Action: "Send Email"
- Parameters:
  - to: "{employee.email}"
  - subject: "Welcome to the Team!"
  - body: "Welcome email template"

**5. Task Node: IT Setup**
- Title: "Provision Access and Equipment"
- Assignee: "IT Support"
- Custom Fields:
  - Systems: "Email, Slack, GitHub"
  - Equipment: "Laptop, Monitor"

**6. End Node**
- End Message: "Onboarding Complete"
- Summary Flag: ✓ (Generate report)

---

## Example 2: Leave Request Workflow

### Workflow Structure
```
Start → Task (Submit Request) → Approval (Manager) → Automated (Update Calendar) → End
```

### Node Configuration

**1. Start Node**
- Title: "Leave Request Process"
- Metadata:
  - Type: "Time Off"

**2. Task Node**
- Title: "Submit Leave Request"
- Assignee: "Employee"
- Custom Fields:
  - Leave Type: "Vacation/Sick/Personal"
  - Start Date: ""
  - End Date: ""
  - Days: ""

**3. Approval Node**
- Title: "Manager Approval"
- Approver Role: "Manager"
- Auto-approve Threshold: 3 (auto-approve if ≤ 3 days)

**4. Automated Node**
- Title: "Update Systems"
- Action: "Update HRMS"
- Parameters:
  - employeeId: "{employee.id}"
  - field: "leave_balance"
  - value: "{calculated_balance}"

**5. Automated Node: Notify Team**
- Title: "Notify Team Members"
- Action: "Send Slack Notification"
- Parameters:
  - channel: "#team-updates"
  - message: "{employee.name} will be out {dates}"

**6. End Node**
- End Message: "Leave request processed"
- Summary Flag: ✓

---

## Example 3: Document Verification Workflow

### Workflow Structure
```
Start → Task (Upload Documents) → Automated (Scan Documents) → Approval (Compliance Review) → End
```

### Detailed Steps

1. **Drag nodes** from sidebar in this order: Start → Task → Automated → Approval → End
2. **Connect nodes** by dragging from bottom handle to top handle
3. **Configure each node** by clicking on it
4. **Test workflow** using the "Test Workflow" button
5. **Export** the workflow for deployment

---

## Testing Your Workflow

### Pre-Test Checklist
- ✓ Start node is connected to at least one node
- ✓ End node exists and is reachable
- ✓ No disconnected nodes (check warnings)
- ✓ No circular dependencies
- ✓ All required fields are filled

### Running Simulation
1. Click "Test Workflow" button in top toolbar
2. Simulation panel opens on the left
3. Click "Run Simulation"
4. Watch step-by-step execution
5. Review any errors or warnings
6. Check execution time and status

### Interpreting Results
- **Success**: All steps completed without errors
- **Partial**: Some steps completed with warnings
- **Failed**: Critical errors prevented completion

---

## Best Practices

### Node Naming
- Use clear, action-oriented titles
- Include the actor (who performs the action)
- Example: "Manager Reviews Application" vs "Review"

### Workflow Structure
- Keep workflows simple and linear when possible
- Use descriptive labels for complex branches
- Document decision points in approval nodes

### Automation Selection
- Choose appropriate automated actions
- Fill all required parameters
- Test email/notification content

### Validation
- Fix all errors before testing
- Address warnings for production workflows
- Validate data flows between nodes

---

## Keyboard Shortcuts

- **Delete**: Delete selected node/edge
- **Cmd/Ctrl + Scroll**: Zoom in/out
- **Space + Drag**: Pan canvas
- **Click + Drag**: Select multiple nodes

---

## Export/Import

### Exporting
1. Click "Export" button in toolbar
2. Save JSON file to your computer
3. File contains complete workflow definition

### Importing (Future Feature)
- Load saved workflow from JSON
- Version control with Git
- Share workflows across teams

---

## Common Issues

### "Workflow has validation errors"
- Check for disconnected nodes
- Ensure Start and End nodes exist
- Look for circular dependencies

### "Simulation failed"
- Verify all nodes have required fields
- Check approval thresholds are valid numbers
- Ensure automated actions have all parameters

### Nodes not connecting
- Drag from source handle (bottom) to target handle (top)
- Start nodes cannot receive connections
- End nodes cannot send connections

---

## Advanced Features

### Metadata in Start Node
Use metadata to pass context through the workflow:
- Employee ID
- Department
- Request Type
- Priority Level

### Custom Fields in Tasks
Add domain-specific data:
- Cost centers
- Project codes
- Compliance flags
- Risk assessments

### Auto-Approve Thresholds
Set monetary or time limits for automatic approvals:
- Expense requests under $500
- Leave requests under 3 days
- Equipment purchases under $1000

---

## Next Steps

1. **Build your first workflow** using the examples above
2. **Test thoroughly** with various scenarios
3. **Export and version control** your workflows
4. **Share with stakeholders** for feedback
5. **Iterate and improve** based on testing

For more information, see the main README.md file.
