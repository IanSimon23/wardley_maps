# Wardley Mapper - Comprehensive Test Plan

## Document Information
- **Version:** 2.3
- **Last Updated:** December 2024
- **Test Environment:** Local (Vercel Dev) + Production (Vercel)
- **Browsers:** Chrome, Firefox, Safari, Edge

---

## Test Scope

### In Scope
- Frontend functionality (all UI interactions)
- Canvas operations (zoom, pan, drag)
- Component management (CRUD operations)
- Evolution arrows and connections
- Strategic zones and annotations
- AI Coach integration
- Data persistence (localStorage)
- Import/Export functionality
- Modal workflows
- Keyboard shortcuts

### Out of Scope
- Backend API performance testing (Anthropic API)
- Cross-browser visual regression (manual only)
- Mobile/touch device testing (not optimized)
- Load/stress testing
- Security penetration testing

---

## 1. Component Management Tests

### 1.1 Adding Components

**Test Case 1.1.1: Add Component via Modal**
- **Steps:**
  1. Click "➕ Add Component" button in header
  2. Enter component name "Test Component"
  3. Select stage "Custom-Built"
  4. Click "Add Component"
- **Expected:**
  - Modal closes
  - Component appears on canvas at appropriate stage position
  - Component appears in sidebar list with correct stage badge
  - Component count updates in sidebar header
  - Component auto-zooms into view
  - Map auto-saves to localStorage
- **Priority:** HIGH

**Test Case 1.1.2: Add Component with Enter Key**
- **Steps:**
  1. Click "➕ Add Component"
  2. Enter component name
  3. Press Enter key
- **Expected:**
  - Same as 1.1.1
- **Priority:** MEDIUM

**Test Case 1.1.3: Add Component - Empty Name**
- **Steps:**
  1. Click "➕ Add Component"
  2. Leave name field empty
  3. Click "Add Component"
- **Expected:**
  - Alert: "Please enter a component name"
  - Modal remains open
  - No component created
- **Priority:** HIGH

**Test Case 1.1.4: Add Multiple Components**
- **Steps:**
  1. Add 5 components with different names
  2. Use different stages for each
- **Expected:**
  - All components appear on canvas
  - Each positioned at correct stage center
  - Components stagger vertically (y = 200 + index * 40)
  - All appear in sidebar list
  - Count shows "Components (5)"
- **Priority:** HIGH

### 1.2 Component Interactions

**Test Case 1.2.1: Drag Component**
- **Steps:**
  1. Add component in Genesis
  2. Drag component to Commodity zone
- **Expected:**
  - Component moves smoothly with cursor
  - Stage badge updates to show new stage
  - Component stays within canvas bounds (x >= 0)
  - Auto-saves on release
  - Connections update if any exist
- **Priority:** HIGH

**Test Case 1.2.2: Click Component in List**
- **Steps:**
  1. Add component
  2. Pan away from component
  3. Click component name in sidebar
- **Expected:**
  - Canvas pans to center component in viewport
  - Component briefly glows (box-shadow effect for 1 second)
  - Zoom level unchanged
- **Priority:** HIGH

**Test Case 1.2.3: Hover Component - Show Actions**
- **Steps:**
  1. Add component
  2. Hover mouse over component node
- **Expected:**
  - Node highlights (border changes)
  - Action buttons appear: Add Note, Evolve, Connect, Delete
  - Buttons remain visible while hovering
  - Buttons disappear when mouse leaves
- **Priority:** MEDIUM

**Test Case 1.2.4: Delete Component**
- **Steps:**
  1. Add component with connections
  2. Hover over component
  3. Click "Delete" button
- **Expected:**
  - Component removed from canvas
  - Component removed from sidebar list
  - All connections to/from component removed
  - Component count updates
  - Auto-saves
- **Priority:** HIGH

### 1.3 Component Notes

**Test Case 1.3.1: Add Note to Component**
- **Steps:**
  1. Add component
  2. Hover and click "Add Note" (or "📝" badge)
  3. Enter note text "Test strategic note"
  4. Click "Save Note"
- **Expected:**
  - Modal closes
  - 💭 badge appears on component
  - Note saved with component
  - Auto-saves to localStorage
- **Priority:** HIGH

**Test Case 1.3.2: Edit Existing Note**
- **Steps:**
  1. Add component with note
  2. Click 💭 badge
  3. Modify note text
  4. Click "Save Note"
- **Expected:**
  - Updated note saved
  - Badge remains visible
- **Priority:** MEDIUM

**Test Case 1.3.3: Delete Note**
- **Steps:**
  1. Add component with note
  2. Click 💭 badge
  3. Click "Clear Note"
  4. Confirm in dialog
- **Expected:**
  - Note deleted
  - 💭 badge disappears
  - Auto-saves
- **Priority:** MEDIUM

**Test Case 1.3.4: Note in Export**
- **Steps:**
  1. Add component with note
  2. Export map
- **Expected:**
  - JSON includes "note" field with text
- **Priority:** LOW

---

## 2. Evolution & Connection Tests

### 2.1 Evolution Arrows

**Test Case 2.1.1: Enable Evolution**
- **Steps:**
  1. Add component in Genesis
  2. Hover and click "Evolve" button
- **Expected:**
  - Orange evolution arrow appears
  - Arrow points from component center to Custom-Built stage center
  - Label "evolving" appears above arrow
  - Stage badge shows "genesis → custom"
  - Button changes to "✓ Evolving"
  - Auto-saves
- **Priority:** HIGH

**Test Case 2.1.2: Drag Evolution Arrow**
- **Steps:**
  1. Add component with evolution enabled
  2. Hover over evolution arrow (cursor changes to ↔)
  3. Drag arrow left/right
- **Expected:**
  - Arrow end point moves with cursor
  - Target stage updates based on arrow position
  - Stage badge updates (e.g., "genesis → product")
  - Arrow length changes smoothly
  - Auto-saves on release
- **Priority:** HIGH

**Test Case 2.1.3: Evolution Arrow Follows Component**
- **Steps:**
  1. Add component with evolution enabled
  2. Drag component vertically (up/down)
- **Expected:**
  - Arrow moves with component
  - Arrow maintains horizontal target position
  - Arrow stays connected to component center
- **Priority:** HIGH

**Test Case 2.1.4: Evolution Arrow Follows Component Horizontally**
- **Steps:**
  1. Add component with evolution enabled
  2. Drag component horizontally (left/right)
- **Expected:**
  - Arrow moves with component
  - Arrow maintains its stored target X position
  - Arrow does NOT jump to new stage center
- **Priority:** HIGH

**Test Case 2.1.5: Disable Evolution**
- **Steps:**
  1. Add component with evolution enabled
  2. Click "✓ Evolving" button again
- **Expected:**
  - Arrow disappears
  - Stage badge returns to single stage
  - Button returns to "Evolve"
  - Auto-saves
- **Priority:** MEDIUM

### 2.2 Component Connections

**Test Case 2.2.1: Create Connection**
- **Steps:**
  1. Add two components A and B
  2. Hover over A, click "Connect"
  3. Click on component B
- **Expected:**
  - Curved line appears from A to B
  - Arrow head points to B
  - Connection mode indicator disappears
  - Auto-saves
- **Priority:** HIGH

**Test Case 2.2.2: Connection Follows Components**
- **Steps:**
  1. Create connection between A and B
  2. Drag component A to new position
  3. Drag component B to new position
- **Expected:**
  - Connection line updates in real-time during drag
  - Curve adjusts to maintain smooth path
  - Arrow head stays pointed at target
- **Priority:** HIGH

**Test Case 2.2.3: Multiple Connections**
- **Steps:**
  1. Add components A, B, C, D
  2. Create connections: A→B, B→C, C→D, A→D
- **Expected:**
  - All connections visible
  - No overlap issues
  - Lines don't obscure components
- **Priority:** MEDIUM

**Test Case 2.2.4: Connection Mode Cancel**
- **Steps:**
  1. Click "Connect" on component A
  2. Click on empty canvas (not another component)
- **Expected:**
  - Connection mode cancels
  - No connection created
  - Mode indicator disappears
- **Priority:** LOW

---

## 3. Canvas Navigation Tests

### 3.1 Panning

**Test Case 3.1.1: Pan with Space+Drag**
- **Steps:**
  1. Hold Space key
  2. Cursor changes to grab icon
  3. Click and drag canvas
  4. Release mouse
  5. Release Space key
- **Expected:**
  - Cursor shows "grab" while Space pressed
  - Cursor shows "grabbing" while dragging
  - Canvas pans smoothly in all directions
  - Cannot pan past left edge (Genesis boundary)
  - Can pan right, up, down freely
  - Pan position persists after release
- **Priority:** HIGH

**Test Case 3.1.2: Pan with Middle Mouse Button**
- **Steps:**
  1. Click and hold middle mouse button
  2. Drag canvas
  3. Release
- **Expected:**
  - Same behavior as Space+Drag
  - Works without Space key
- **Priority:** MEDIUM

**Test Case 3.1.3: Pan Boundary - Left Edge**
- **Steps:**
  1. Pan all the way left
  2. Try to pan further left
- **Expected:**
  - Cannot pan past x=0 (Genesis left edge)
  - Canvas stops at boundary
  - Can still pan right/up/down
- **Priority:** HIGH

### 3.2 Zooming

**Test Case 3.2.1: Zoom with Scroll Wheel**
- **Steps:**
  1. Scroll wheel up (zoom in)
  2. Scroll wheel down (zoom out)
- **Expected:**
  - Smooth zoom from 30% to 300%
  - Zoom indicator updates (bottom right)
  - All content scales together
  - Evolution zone labels stay at consistent size
  - Fixed UI stays at consistent size
- **Priority:** HIGH

**Test Case 3.2.2: Zoom with Buttons**
- **Steps:**
  1. Click "+" button
  2. Click "−" button
  3. Click "Reset" button
- **Expected:**
  - "+" zooms in by 20%
  - "−" zooms out by 20%
  - "Reset" returns to 100% and centers view
  - Zoom indicator updates each time
- **Priority:** HIGH

**Test Case 3.2.3: Zoom at Different Positions**
- **Steps:**
  1. Pan to show Genesis
  2. Zoom in
  3. Pan to show Commodity
  4. Zoom in
- **Expected:**
  - Zoom maintains current viewport center
  - Content scales from top-left origin
  - Labels remain readable
- **Priority:** MEDIUM

**Test Case 3.2.4: Zoom Limits**
- **Steps:**
  1. Zoom in repeatedly to max
  2. Zoom out repeatedly to min
- **Expected:**
  - Max zoom: 300%
  - Min zoom: 30%
  - Cannot exceed limits
  - Buttons still work at limits
- **Priority:** LOW

### 3.3 Evolution Zone Labels

**Test Case 3.3.1: Labels Visible at 100% Zoom**
- **Steps:**
  1. View canvas at 100% zoom
- **Expected:**
  - All four stage labels visible at bottom
  - Labels: Genesis, Custom-Built, Product, Commodity
  - Color-coded borders match stage colors
  - Font size: 1.5rem (readable)
- **Priority:** HIGH

**Test Case 3.3.2: Labels Visible at 50% Zoom**
- **Steps:**
  1. Zoom out to 50%
- **Expected:**
  - Labels still clearly readable
  - Font remains sharp and visible
- **Priority:** HIGH

**Test Case 3.3.3: Labels Scale with Canvas**
- **Steps:**
  1. Pan to Genesis
  2. Zoom in to 200%
- **Expected:**
  - Genesis label gets larger with zoom
  - Label stays at bottom of zone
  - Other labels off-screen or partially visible
- **Priority:** MEDIUM

---

## 4. Strategic Zones Tests

### 4.1 Creating Zones

**Test Case 4.1.1: Add Opportunity Zone**
- **Steps:**
  1. Click "💡 Opportunity" in toolbar
- **Expected:**
  - Green dashed border zone appears on canvas
  - Default size: 300x200px
  - Label "opportunity" at top
  - Semi-transparent green background
  - Positioned at y=300 + (zone count * 50)
- **Priority:** HIGH

**Test Case 4.1.2: Add All Zone Types**
- **Steps:**
  1. Add one of each zone type:
     - 💡 Opportunity (green)
     - ⚠️ Inertia (orange)
     - 🚨 Threat (red)
     - ⚔️ War (purple)
     - 📝 Note (blue)
- **Expected:**
  - Each zone appears with correct color
  - Labels show correct type
  - Zones stack vertically if added sequentially
- **Priority:** HIGH

### 4.2 Zone Interactions

**Test Case 4.2.1: Drag Zone**
- **Steps:**
  1. Add zone
  2. Click and drag zone (not on handles)
- **Expected:**
  - Zone moves with cursor
  - Cannot move past left edge (x >= 0)
  - Cursor shows "move"
  - Auto-saves on release
- **Priority:** HIGH

**Test Case 4.2.2: Resize Zone - Southeast Corner**
- **Steps:**
  1. Add zone
  2. Hover over zone (handles appear)
  3. Drag southeast (bottom-right) handle
- **Expected:**
  - Zone expands/contracts from bottom-right
  - Top-left position stays fixed
  - Minimum size: 100x100px
  - Cursor shows resize arrow (↘)
- **Priority:** HIGH

**Test Case 4.2.3: Resize Zone - Northwest Corner**
- **Steps:**
  1. Add zone
  2. Drag northwest (top-left) handle
- **Expected:**
  - Zone expands/contracts from top-left
  - Bottom-right position stays fixed
  - Zone position adjusts as size changes
  - Minimum size enforced
- **Priority:** HIGH

**Test Case 4.2.4: Resize Zone - All Corners**
- **Steps:**
  1. Add zone
  2. Test all 4 corner handles: NW, NE, SW, SE
- **Expected:**
  - Each handle resizes from its corner
  - Appropriate cursor icon for each (↖ ↗ ↙ ↘)
  - Minimum size enforced on all
  - Handles only visible on hover
- **Priority:** MEDIUM

**Test Case 4.2.5: Hover Zone - Show Handles**
- **Steps:**
  1. Add zone
  2. Hover over zone
  3. Move mouse off zone
- **Expected:**
  - 4 blue circular handles appear at corners
  - Handles fade in (opacity transition)
  - Handles disappear when mouse leaves
- **Priority:** LOW

**Test Case 4.2.6: Delete Zone**
- **Steps:**
  1. Add zone
  2. Hover over zone
  3. Click "Delete" button
- **Expected:**
  - Zone removed from canvas
  - No confirmation dialog
  - Auto-saves
- **Priority:** MEDIUM

### 4.3 Zone Notes

**Test Case 4.3.1: Add Note to Zone**
- **Steps:**
  1. Add zone
  2. Double-click zone
  3. Enter note text
  4. Click "Save Note"
- **Expected:**
  - Modal closes
  - 💭 badge appears at top-right of zone
  - Note saved with zone
  - Auto-saves
- **Priority:** HIGH

**Test Case 4.3.2: Zone Note via Badge**
- **Steps:**
  1. Add zone with note
  2. Click 💭 badge
  3. Modify note
  4. Save
- **Expected:**
  - Note updates
  - Badge remains visible
- **Priority:** MEDIUM

**Test Case 4.3.3: Zone Note in AI Context**
- **Steps:**
  1. Add zone with note "Strategic focus area"
  2. Open AI Coach
  3. Click "Analyze Map"
- **Expected:**
  - AI response includes reference to zone note
  - Context includes zone type and note content
- **Priority:** MEDIUM

### 4.4 Zone Layering

**Test Case 4.4.1: Zones Behind Components**
- **Steps:**
  1. Add zone at position (100, 100)
  2. Add component at same position
- **Expected:**
  - Zone renders behind component (z-index: 5)
  - Component fully visible on top
  - Zone semi-transparent background visible
- **Priority:** MEDIUM

**Test Case 4.4.2: Overlapping Zones**
- **Steps:**
  1. Add two zones at overlapping positions
- **Expected:**
  - Both zones visible
  - Second zone renders on top
  - Can interact with both (hover shows correct handles)
- **Priority:** LOW

---

## 5. AI Coach Tests

### 5.1 Basic Functionality

**Test Case 5.1.1: Open/Close AI Coach**
- **Steps:**
  1. Click "🤖 AI Coach" button in header
  2. Click button again to close
- **Expected:**
  - Panel slides in from right (400px wide)
  - Button shows "active" state when open
  - Panel slides out when clicked again
  - State persists in localStorage
- **Priority:** HIGH

**Test Case 5.1.2: AI Coach Default State**
- **Steps:**
  1. Open fresh page
  2. Check AI Coach panel
- **Expected:**
  - Coach starts collapsed (hidden)
  - Canvas uses full width
- **Priority:** MEDIUM

**Test Case 5.1.3: Send Message to AI**
- **Steps:**
  1. Open AI Coach
  2. Type message "Analyze my map"
  3. Click "Send" or press Enter
- **Expected:**
  - Message appears in chat history
  - Loading indicator appears
  - AI response appears after ~2-5 seconds
  - Response formatted with line breaks
  - Auto-saves chat history
- **Priority:** HIGH

**Test Case 5.1.4: Quick Prompts**
- **Steps:**
  1. Open AI Coach
  2. Click "Analyze my current map" button
- **Expected:**
  - Prompt auto-fills input
  - Message sends automatically
  - AI responds with analysis
- **Priority:** MEDIUM

### 5.2 Context Awareness

**Test Case 5.2.1: AI Sees Map Components**
- **Steps:**
  1. Add components A, B, C
  2. Ask AI "What components do I have?"
- **Expected:**
  - AI response lists components A, B, C
  - Mentions their stages
  - References map context
- **Priority:** HIGH

**Test Case 5.2.2: AI Sees Evolution**
- **Steps:**
  1. Add component with evolution arrow
  2. Ask AI "What is evolving?"
- **Expected:**
  - AI identifies evolving component
  - Mentions source and target stage
- **Priority:** MEDIUM

**Test Case 5.2.3: AI Sees Connections**
- **Steps:**
  1. Create value chain: A→B→C
  2. Ask AI "What are my dependencies?"
- **Expected:**
  - AI describes dependency chain
  - Identifies value chain structure
- **Priority:** MEDIUM

**Test Case 5.2.4: AI Sees Zone Notes**
- **Steps:**
  1. Add Opportunity zone with note "Market expansion"
  2. Ask AI "What opportunities do you see?"
- **Expected:**
  - AI references the opportunity zone
  - Mentions the note content
- **Priority:** LOW

### 5.3 Error Handling

**Test Case 5.3.1: Backend Server Down**
- **Steps:**
  1. Stop backend server
  2. Send message to AI
- **Expected:**
  - Error message appears in chat
  - "Please check that the backend server is running"
  - No crash or hang
- **Priority:** HIGH

**Test Case 5.3.2: Network Timeout**
- **Steps:**
  1. Simulate slow/failed network
  2. Send message
- **Expected:**
  - Error message after timeout
  - User can try again
  - Chat history preserved
- **Priority:** MEDIUM

**Test Case 5.3.3: Empty Message**
- **Steps:**
  1. Click Send with empty input
- **Expected:**
  - Nothing happens
  - No error
  - No API call made
- **Priority:** LOW

---

## 6. Data Persistence Tests

### 6.1 LocalStorage

**Test Case 6.1.1: Auto-Save on Action**
- **Steps:**
  1. Add component
  2. Check localStorage ("wardleyMapData")
- **Expected:**
  - Data saved immediately
  - JSON includes nodes array with new component
  - Timestamp updated
- **Priority:** HIGH

**Test Case 6.1.2: Restore on Page Load**
- **Steps:**
  1. Add components and zones
  2. Refresh page (F5)
- **Expected:**
  - All components restored
  - All zones restored
  - All connections restored
  - Component counter restored
  - Canvas state identical to before refresh
- **Priority:** HIGH

**Test Case 6.1.3: AI Chat History Persistence**
- **Steps:**
  1. Have conversation with AI (3-4 messages)
  2. Refresh page
  3. Open AI Coach
- **Expected:**
  - All messages restored
  - Chat history intact
  - Can continue conversation
- **Priority:** MEDIUM

**Test Case 6.1.4: Clear Canvas Clears Storage**
- **Steps:**
  1. Add components
  2. Click "Clear" and confirm
  3. Check localStorage
- **Expected:**
  - localStorage still exists
  - Empty arrays for nodes, connections, zones
  - Counters reset to 0
- **Priority:** MEDIUM

### 6.2 Export/Import

**Test Case 6.2.1: Export Map**
- **Steps:**
  1. Create map with components, zones, connections
  2. Click "Export"
  3. Check JSON in modal
- **Expected:**
  - Modal opens with formatted JSON
  - JSON includes: nodes, connections, zones
  - Each node includes: id, label, x, y, stage
  - Nodes with evolution include: evolving, evolvingTo, evolutionTargetX
  - Nodes/zones with notes include: note field
- **Priority:** HIGH

**Test Case 6.2.2: Copy Export Data**
- **Steps:**
  1. Export map
  2. Click "Copy to Clipboard"
  3. Paste into text editor
- **Expected:**
  - Valid JSON copied to clipboard
  - Can paste into external editor
  - Success feedback shown
- **Priority:** MEDIUM

**Test Case 6.2.3: Download Export**
- **Steps:**
  1. Export map
  2. Click "Download JSON"
- **Expected:**
  - File downloads as "wardley-map.json"
  - Valid JSON format
  - Can be opened and read
- **Priority:** MEDIUM

**Test Case 6.2.4: Import Valid Map**
- **Steps:**
  1. Export map A
  2. Clear canvas
  3. Import map A JSON
- **Expected:**
  - Map A fully restored
  - All components in correct positions
  - All connections present
  - All zones with correct properties
  - Notes preserved
  - Evolution arrows restored
- **Priority:** HIGH

**Test Case 6.2.5: Import Invalid JSON**
- **Steps:**
  1. Click "Import"
  2. Paste malformed JSON
  3. Click "Import"
- **Expected:**
  - Alert: "Invalid JSON data"
  - No changes to current map
  - Modal stays open for retry
- **Priority:** MEDIUM

**Test Case 6.2.6: Import Overwrites Current**
- **Steps:**
  1. Create map A
  2. Import map B (different data)
- **Expected:**
  - Map A completely replaced by map B
  - No merge of data
  - Clean import
- **Priority:** MEDIUM

---

## 7. Modal & UI Tests

### 7.1 Modal Behavior

**Test Case 7.1.1: Help Modal**
- **Steps:**
  1. Click "❓ Help" button
  2. Read content
  3. Click "Close"
- **Expected:**
  - Modal opens centered
  - Comprehensive instructions visible
  - Scrollable content (>500px height)
  - All sections present:
    - Getting Started
    - Controls
    - Component Actions
    - Strategic Zones
    - AI Strategy Coach
    - Saving & Sharing
  - Closes cleanly
- **Priority:** HIGH

**Test Case 7.1.2: Add Component Modal Focus**
- **Steps:**
  1. Click "➕ Add Component"
- **Expected:**
  - Input field auto-focused
  - Cursor in name field
  - Can immediately start typing
- **Priority:** MEDIUM

**Test Case 7.1.3: Modal Overlay Click**
- **Steps:**
  1. Open any modal
  2. Click outside modal (on dark overlay)
- **Expected:**
  - Modal remains open
  - No accidental closure
  - Must click Close/Cancel button
- **Priority:** LOW

**Test Case 7.1.4: Modal ESC Key**
- **Steps:**
  1. Open any modal
  2. Press ESC key
- **Expected:**
  - Modal closes
  - Returns to canvas
- **Priority:** LOW (NOT IMPLEMENTED - Feature request)

### 7.2 Component List UI

**Test Case 7.2.1: Empty State**
- **Steps:**
  1. Clear canvas
  2. Check sidebar
- **Expected:**
  - "Components (0)"
  - Message: "Click '➕ Add Component' above to get started"
  - No component items
- **Priority:** LOW

**Test Case 7.2.2: Populated List**
- **Steps:**
  1. Add 5 components with different stages
  2. Check sidebar
- **Expected:**
  - "Components (5)"
  - Each component shows:
    - Name
    - Stage badge (color-coded)
    - Left border matches stage color
  - Sorted in order added (not alphabetical)
- **Priority:** MEDIUM

**Test Case 7.2.3: List Hover Effect**
- **Steps:**
  1. Add components
  2. Hover over each item in list
- **Expected:**
  - Background changes
  - Border highlights in accent color
  - Slides right slightly (transform: translateX(4px))
  - Cursor shows pointer
- **Priority:** LOW

**Test Case 7.2.4: List Scrolling**
- **Steps:**
  1. Add 20+ components
  2. Check sidebar list
- **Expected:**
  - List becomes scrollable
  - Vertical scrollbar appears
  - All components accessible
  - Smooth scrolling
- **Priority:** LOW

---

## 8. Edge Cases & Error Handling

### 8.1 Boundary Conditions

**Test Case 8.1.1: Maximum Components**
- **Steps:**
  1. Add 100 components
- **Expected:**
  - All components created
  - Performance remains acceptable
  - No crashes or hangs
  - List scrollable
- **Priority:** LOW

**Test Case 8.1.2: Very Long Component Names**
- **Steps:**
  1. Add component with 200 character name
- **Expected:**
  - Name truncates or wraps appropriately
  - No layout breaking
  - Visible in list
- **Priority:** LOW

**Test Case 8.1.3: Special Characters in Names**
- **Steps:**
  1. Add component: "Test<>&'"Component"
- **Expected:**
  - Characters properly escaped
  - No XSS vulnerabilities
  - Displays correctly
- **Priority:** MEDIUM

**Test Case 8.1.4: Zoom at Extreme Values**
- **Steps:**
  1. Zoom to 30% (minimum)
  2. Test all interactions
  3. Zoom to 300% (maximum)
  4. Test all interactions
- **Expected:**
  - All features work at both extremes
  - UI remains functional
  - Text readable at 300%
  - Clickable targets large enough at 30%
- **Priority:** LOW

### 8.2 LocalStorage Limits

**Test Case 8.2.1: Large Map Export**
- **Steps:**
  1. Create map with 50 components, 100 connections, 20 zones
  2. Add notes to all components
  3. Save and export
- **Expected:**
  - Saves successfully
  - Exports complete JSON
  - Stays within localStorage limit (~5MB)
- **Priority:** LOW

**Test Case 8.2.2: LocalStorage Full**
- **Steps:**
  1. Fill localStorage with other data
  2. Try to save map
- **Expected:**
  - Graceful error handling
  - User notified of issue
  - Map still functional (unsaved)
- **Priority:** LOW

**Test Case 8.2.3: Corrupted LocalStorage**
- **Steps:**
  1. Manually corrupt localStorage data
  2. Reload page
- **Expected:**
  - Loads with empty/default state
  - No crash
  - Error logged to console
- **Priority:** LOW

### 8.3 Concurrent Actions

**Test Case 8.3.1: Drag While Zooming**
- **Steps:**
  1. Start dragging component
  2. Scroll to zoom while dragging
- **Expected:**
  - Drag operation continues smoothly
  - No jerky movement
  - Component placed correctly on release
- **Priority:** LOW

**Test Case 8.3.2: Multiple Rapid Actions**
- **Steps:**
  1. Rapidly add 10 components (click spam)
- **Expected:**
  - All components created
  - No duplicate IDs
  - Counter accurate
  - No crashes
- **Priority:** LOW

---

## 9. Browser Compatibility Tests

### 9.1 Chrome (v120+)
- **Run all test cases above**
- **Expected:** Full functionality, baseline browser
- **Priority:** HIGH

### 9.2 Firefox (v120+)
- **Run all test cases above**
- **Known issues:** Test drag operations specifically
- **Priority:** HIGH

### 9.3 Safari (v17+)
- **Run all test cases above**
- **Known issues:** Test localStorage, fetch API
- **Priority:** MEDIUM

### 9.4 Edge (v120+)
- **Run all test cases above**
- **Expected:** Should match Chrome behavior
- **Priority:** MEDIUM

---

## 10. Performance Tests

### 10.1 Render Performance

**Test Case 10.1.1: Initial Load**
- **Steps:**
  1. Load page with empty map
  2. Measure time to interactive
- **Expected:**
  - < 1 second to fully loaded
  - < 500ms to interactive
- **Priority:** MEDIUM

**Test Case 10.1.2: Large Map Load**
- **Steps:**
  1. Import map with 50 components, 100 connections
  2. Measure render time
- **Expected:**
  - < 2 seconds to fully rendered
  - Smooth animations
  - No jank
- **Priority:** LOW

**Test Case 10.1.3: Drag Performance**
- **Steps:**
  1. Add 20 components with connections
  2. Drag component across canvas
  3. Observe FPS
- **Expected:**
  - Smooth 60fps during drag
  - Connections update in real-time
  - No lag
- **Priority:** MEDIUM

### 10.2 AI Coach Performance

**Test Case 10.2.1: Response Time**
- **Steps:**
  1. Send message to AI
  2. Measure time to first response
- **Expected:**
  - < 5 seconds typical response
  - < 10 seconds maximum
  - Loading indicator throughout
- **Priority:** MEDIUM

**Test Case 10.2.2: Large Context**
- **Steps:**
  1. Create map with 50 components, all with notes
  2. Ask AI to analyze
- **Expected:**
  - Still responds within 10 seconds
  - Context doesn't break API limits
  - Response quality maintained
- **Priority:** LOW

---

## 11. Regression Test Suite

**Run after each code change:**

### Critical Path Tests (Run every time)
1. Add component via modal
2. Drag component to new stage
3. Create connection between two components
4. Enable evolution on component
5. Add strategic zone
6. Resize zone
7. Pan with Space+Drag
8. Zoom with scroll wheel
9. Click component in list to zoom
10. Export map
11. Import map
12. Send message to AI Coach
13. Refresh page and verify persistence

### Full Regression (Run before release)
- All test cases marked **HIGH** priority
- All test cases marked **MEDIUM** priority
- Sample of **LOW** priority test cases

---

## 12. Test Environment Setup

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Add ANTHROPIC_API_KEY=sk-ant-xxxxx

# 3. Start server
vercel dev

# 4. Open browser
http://localhost:3000
```

### Production (Vercel)
- URL: https://your-app.vercel.app
- Environment variables set in Vercel dashboard
- Test with actual deployed version

### Browser DevTools
- Console: Check for errors/warnings
- Network: Monitor API calls
- Application: Inspect localStorage
- Performance: Record FPS during interactions

---

## 13. Bug Reporting Template

```
**Title:** [Brief description]

**Priority:** [High/Medium/Low]

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**


**Actual Result:**


**Browser:** [Chrome/Firefox/Safari/Edge + version]

**Environment:** [Local/Production]

**Screenshots/Video:** [If applicable]

**Console Errors:** [Copy from DevTools]

**Additional Notes:**

```

---

## 14. Test Metrics & Goals

### Coverage Goals
- **Critical Path:** 100% pass rate
- **High Priority:** 95% pass rate
- **Medium Priority:** 90% pass rate
- **Low Priority:** 80% pass rate

### Performance Goals
- **Initial Load:** < 1 second
- **Large Map Load:** < 2 seconds
- **Drag Operations:** 60 FPS
- **AI Response:** < 5 seconds (typical)

### Quality Gates
- ✅ Zero critical bugs before release
- ✅ All high-priority tests passing
- ✅ No console errors in happy path
- ✅ Works in Chrome, Firefox, Safari
- ✅ LocalStorage persistence verified

---

## 15. Test Execution Log

| Date | Tester | Tests Run | Pass | Fail | Notes |
|------|--------|-----------|------|------|-------|
| YYYY-MM-DD | Name | X/Y | X | Y | |

---

## 16. Known Issues & Limitations

### Current Known Issues
1. Evolution arrow may shift slightly when toggling AI Coach (cosmetic)
2. Mobile/touch not optimized (out of scope)
3. ESC key doesn't close modals (feature request)

### Limitations
- LocalStorage ~5MB limit
- Single map per browser session
- No undo/redo functionality
- No real-time collaboration
- AI Coach requires backend server

---

## Appendix A: Keyboard Shortcuts Reference

| Action | Shortcut |
|--------|----------|
| Pan canvas | Space + Drag |
| Zoom in | Scroll Up |
| Zoom out | Scroll Down |
| Add component | (None - use button) |
| Send AI message | Enter (in input) |

---

## Appendix B: Test Data

### Sample Map 1 (Simple)
```json
{
  "nodes": [
    {"id": 0, "label": "User Needs", "x": 200, "y": 100, "stage": "custom"},
    {"id": 1, "label": "Web App", "x": 400, "y": 200, "stage": "product"}
  ],
  "connections": [{"from": 0, "to": 1}],
  "zones": []
}
```

### Sample Map 2 (Complex)
- 15 components across all stages
- 25 connections forming value chain
- 5 zones (all types)
- 10 components with notes
- 3 components with evolution arrows

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12 | Initial | Complete test plan created |
