# Quick Reference Guide

## 🚀 Quick Start (30 seconds)

1. **Open browser**: http://localhost:5173
2. **Drag Start node** from left sidebar to canvas
3. **Drag Task node** to canvas
4. **Connect**: Click bottom of Start → top of Task
5. **Configure**: Click Task node → fill in details
6. **Test**: Click "Test Workflow" button

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Delete` / `Backspace` | Delete selected node/edge |
| `Cmd/Ctrl + Scroll` | Zoom in/out |
| `Space + Drag` | Pan canvas |
| `Click + Drag` | Multi-select |

## 🎨 Node Colors

| Color | Type | Icon |
|-------|------|------|
| 🟢 Green | Start | ▶️ |
| 🔵 Blue | Task | ☑️ |
| 🟠 Orange | Approval | ✓ |
| 🟣 Purple | Automated | ⚡ |
| 🔴 Red | End | ⏹️ |

## 📋 Common Workflows

### Simple Approval
```
Start → Task (Submit) → Approval → End
```

### Complex Onboarding
```
Start → Task (Docs) → Approval (HR) → Automated (Email) → Task (IT) → End
```

### Leave Request
```
Start → Task (Request) → Approval (Manager) → Automated (Update HRMS) → End
```

## 🔧 Node Configuration Reference

### Start Node
- **Title** (required): Workflow name
- **Metadata** (optional): Key-value pairs

### Task Node
- **Title** (required): Task name
- **Description** (optional): Details
- **Assignee** (optional): Person/role
- **Due Date** (optional): Date picker
- **Custom Fields** (optional): Key-value pairs

### Approval Node
- **Title** (required): Approval name
- **Approver Role** (required): Manager/HRBP/Director/VP/C-Level
- **Auto-approve Threshold** (optional): Numeric value

### Automated Node
- **Title** (required): Action name
- **Action** (required): Select from dropdown
- **Parameters** (dynamic): Based on selected action

### End Node
- **Message** (required): Completion message
- **Summary Flag** (optional): Checkbox

## 📊 Available Automation Actions

| Action | Parameters |
|--------|-----------|
| Send Email | to, subject, body |
| Generate Document | template, recipient |
| Create IT Ticket | category, priority, description |
| Update HRMS | employeeId, field, value |
| Send Slack Notification | channel, message |
| Assign Training Module | employeeId, trainingId |
| Provision System Access | system, accessLevel, employeeId |
| Schedule Meeting | attendees, duration, subject |

## ⚠️ Common Errors

| Error | Solution |
|-------|----------|
| "No start node" | Add exactly one Start node |
| "Node not connected" | Connect all nodes with edges |
| "Circular dependency" | Remove loops in workflow |
| "Required field missing" | Fill all required fields (marked with *) |

## 🎯 Toolbar Actions

| Button | Action |
|--------|--------|
| ▶️ **Test Workflow** | Run simulation |
| 📄 **Export** | Save as JSON |
| 🗑️ **Clear** | Delete all nodes |

## 📊 Validation Indicators

| Badge | Meaning |
|-------|---------|
| 🔴 **Error** | Critical issue - must fix |
| 🟡 **Warning** | Suggestion - workflow still valid |

## 🧪 Testing Checklist

- [ ] Start node connected
- [ ] End node reachable
- [ ] All nodes connected
- [ ] No circular paths
- [ ] Required fields filled
- [ ] Validation passes (no red errors)

## 💾 Export Format

```json
{
  "version": "1.0",
  "createdAt": "2025-12-03T...",
  "nodes": [...],
  "edges": [...]
}
```

## 🎓 Best Practices

1. **Name clearly**: Use descriptive node titles
2. **Keep simple**: 5-10 nodes per workflow
3. **Test early**: Validate frequently
4. **Document**: Use metadata and custom fields
5. **Export often**: Save work regularly

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview |
| USAGE_EXAMPLES.md | Detailed workflows |
| ARCHITECTURE.md | Technical details |
| COMPONENT_DIAGRAM.md | Visual structure |
| PROJECT_SUMMARY.md | Complete feature list |
| QUICK_REFERENCE.md | This file |

## 🆘 Troubleshooting

### Issue: Can't connect nodes
- Ensure dragging from source (bottom) to target (top)
- Start nodes: only bottom handle
- End nodes: only top handle

### Issue: Simulation fails
- Check validation errors first
- Ensure all automation parameters filled
- Verify workflow structure is valid

### Issue: Form not updating
- Click outside input to trigger onBlur
- Check browser console for errors

### Issue: Nodes overlapping
- Drag nodes to rearrange
- Use mini-map for navigation
- Zoom out for better view

## 🔗 Quick Links

- **Dev Server**: http://localhost:5173
- **GitHub**: (your repo URL)
- **Documentation**: See project root *.md files

## 📞 Support

Check documentation files for detailed information:
1. Start with README.md for overview
2. See USAGE_EXAMPLES.md for step-by-step guides
3. Review ARCHITECTURE.md for technical details

---

**Pro Tip**: Save this file as a bookmark for quick access during development! 🔖
