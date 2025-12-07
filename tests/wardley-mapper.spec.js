// Wardley Mapper - Automated Test Suite
// Framework: Playwright
// Run with: npx playwright test

import { test, expect } from '@playwright/test';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 10000;

// Test data
const TEST_COMPONENTS = {
  basic: { name: 'Test Component', stage: 'custom' },
  genesis: { name: 'AI Model', stage: 'genesis' },
  commodity: { name: 'Cloud Storage', stage: 'commodity' }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

class WardleyMapperPage {
  constructor(page) {
    this.page = page;
  }

  // Selectors
  get addComponentButton() { return this.page.locator('button:has-text("➕ Add Component")'); }
  get helpButton() { return this.page.locator('button:has-text("❓ Help")'); }
  get aiCoachButton() { return this.page.locator('button:has-text("🤖 AI Coach")'); }
  get exportButton() { return this.page.locator('button:has-text("Export")'); }
  get importButton() { return this.page.locator('button:has-text("Import")'); }
  get clearButton() { return this.page.locator('button:has-text("Clear")'); }
  get saveButton() { return this.page.locator('button.primary:has-text("Save")'); }

  get canvas() { return this.page.locator('#canvas'); }
  get canvasContent() { return this.page.locator('#canvasContent'); }
  get componentList() { return this.page.locator('#componentList'); }
  get componentCount() { return this.page.locator('#componentCount'); }

  get addComponentModal() { return this.page.locator('#addComponentModal'); }
  get newComponentName() { return this.page.locator('#newComponentName'); }
  get newComponentStage() { return this.page.locator('#newComponentStage'); }

  get zoomLevel() { return this.page.locator('#zoomLevel'); }
  get zoomInButton() { return this.page.locator('button.zoom-btn:has-text("+")'); }
  get zoomOutButton() { return this.page.locator('button.zoom-btn:has-text("−")'); }
  get zoomResetButton() { return this.page.locator('button.zoom-btn:has-text("Reset")'); }

  // Actions
  async goto() {
    await this.page.goto(BASE_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async addComponent(name, stage = 'custom') {
    await this.addComponentButton.click();
    await this.newComponentName.fill(name);
    await this.newComponentStage.selectOption(stage);
    await this.page.locator('#addComponentModal button.primary').click();
    await this.page.waitForTimeout(500); // Wait for zoom animation
  }

  async getCanvasNode(label) {
    return this.page.locator('.canvas-node', { hasText: label });
  }

  async getComponentInList(label) {
    return this.page.locator('.component-item', { hasText: label });
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }

  async getLocalStorageData() {
    return await this.page.evaluate(() => {
      const data = localStorage.getItem('wardleyMapData');
      return data ? JSON.parse(data) : null;
    });
  }

  async dragElement(element, deltaX, deltaY) {
    const box = await element.boundingBox();
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width / 2 + deltaX, box.y + box.height / 2 + deltaY, { steps: 10 });
    await this.page.mouse.up();
  }

  async panCanvas(deltaX, deltaY) {
    const box = await this.canvas.boundingBox();
    await this.page.keyboard.down('Space');
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width / 2 + deltaX, box.y + box.height / 2 + deltaY, { steps: 10 });
    await this.page.mouse.up();
    await this.page.keyboard.up('Space');
  }

  async zoom(direction, times = 1) {
    for (let i = 0; i < times; i++) {
      if (direction === 'in') {
        await this.zoomInButton.click();
      } else if (direction === 'out') {
        await this.zoomOutButton.click();
      } else if (direction === 'reset') {
        await this.zoomResetButton.click();
      }
      await this.page.waitForTimeout(100);
    }
  }
}

// ============================================================================
// TEST SUITE: COMPONENT MANAGEMENT
// ============================================================================

test.describe('Component Management', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('1.1.1: Add Component via Modal', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponent('Test Component', 'custom');

    // Check component appears on canvas
    const node = await wardley.getCanvasNode('Test Component');
    await expect(node).toBeVisible();

    // Check component in sidebar list
    const listItem = await wardley.getComponentInList('Test Component');
    await expect(listItem).toBeVisible();

    // Check component count
    await expect(wardley.componentCount).toHaveText('1');

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.nodes).toHaveLength(1);
    expect(data.nodes[0].label).toBe('Test Component');
    expect(data.nodes[0].stage).toBe('custom');
  });

  test('1.1.2: Add Component with Enter Key', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponentButton.click();
    await wardley.newComponentName.fill('Quick Component');
    await wardley.newComponentName.press('Enter');
    await page.waitForTimeout(500);

    const node = await wardley.getCanvasNode('Quick Component');
    await expect(node).toBeVisible();
  });

  test('1.1.3: Add Component - Empty Name', async ({ page }) => {
    // CONFIDENCE: HIGH
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('enter a component name');
      await dialog.accept();
    });

    await wardley.addComponentButton.click();
    await page.locator('#addComponentModal button.primary').click();

    // Modal should stay open
    await expect(wardley.addComponentModal).toHaveClass(/active/);
  });

  test('1.1.4: Add Multiple Components', async ({ page }) => {
    // CONFIDENCE: HIGH
    const components = [
      { name: 'Component A', stage: 'genesis' },
      { name: 'Component B', stage: 'custom' },
      { name: 'Component C', stage: 'product' },
      { name: 'Component D', stage: 'commodity' },
      { name: 'Component E', stage: 'custom' }
    ];

    for (const comp of components) {
      await wardley.addComponent(comp.name, comp.stage);
    }

    await expect(wardley.componentCount).toHaveText('5');

    // Check all visible on canvas
    for (const comp of components) {
      const node = await wardley.getCanvasNode(comp.name);
      await expect(node).toBeVisible();
    }
  });

  test('1.2.1: Drag Component', async ({ page }) => {
    // CONFIDENCE: MEDIUM - Drag operations can be flaky
    await wardley.addComponent('Draggable', 'genesis');

    const node = await wardley.getCanvasNode('Draggable');
    const initialBox = await node.boundingBox();

    // Drag right (towards commodity)
    await wardley.dragElement(node, 500, 0);
    await page.waitForTimeout(500);

    const finalBox = await node.boundingBox();

    // Component should have moved right
    expect(finalBox.x).toBeGreaterThan(initialBox.x);

    // Check stage badge updated
    const stageBadge = node.locator('.node-stage');
    const stageText = await stageBadge.textContent();
    expect(stageText).not.toBe('genesis'); // Should have changed stage

    // Check localStorage updated
    const data = await wardley.getLocalStorageData();
    expect(data.nodes[0].x).toBeGreaterThan(0);
  });

  test('1.2.2: Click Component in List - Zoom to Component', async ({ page }) => {
    // CONFIDENCE: MEDIUM - Animation timing dependent
    await wardley.addComponent('Remote Component', 'commodity');

    // Pan away from component
    await wardley.panCanvas(-500, -300);
    await page.waitForTimeout(500);

    // Click component in list
    const listItem = await wardley.getComponentInList('Remote Component');
    await listItem.click();
    await page.waitForTimeout(1000); // Wait for pan animation

    // Component should be visible and centered (roughly)
    const node = await wardley.getCanvasNode('Remote Component');
    const box = await node.boundingBox();
    const canvasBox = await wardley.canvas.boundingBox();

    // Check if component is roughly centered (within 200px of center)
    const componentCenterX = box.x + box.width / 2;
    const canvasCenterX = canvasBox.x + canvasBox.width / 2;
    expect(Math.abs(componentCenterX - canvasCenterX)).toBeLessThan(200);
  });

  test('1.2.3: Hover Component - Show Actions', async ({ page }) => {
    // CONFIDENCE: MEDIUM - Hover states can be timing-sensitive
    await wardley.addComponent('Hoverable', 'custom');

    const node = await wardley.getCanvasNode('Hoverable');

    // Hover over component
    await node.hover();
    await page.waitForTimeout(300);

    // Action buttons should appear
    const actions = node.locator('.node-actions');
    await expect(actions).toBeVisible();

    // Check for specific buttons
    await expect(node.locator('button:has-text("Evolve")')).toBeVisible();
    await expect(node.locator('button:has-text("Connect")')).toBeVisible();
    await expect(node.locator('button:has-text("Delete")')).toBeVisible();
  });

  test('1.2.4: Delete Component', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponent('Deletable', 'custom');

    const node = await wardley.getCanvasNode('Deletable');
    await node.hover();
    await node.locator('button:has-text("Delete")').click();

    // Component should disappear
    await expect(node).not.toBeVisible();

    // Count should be 0
    await expect(wardley.componentCount).toHaveText('0');

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.nodes).toHaveLength(0);
  });

  test('1.3.1: Add Note to Component', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponent('Notable', 'custom');

    const node = await wardley.getCanvasNode('Notable');
    await node.hover();
    await node.locator('button:has-text("Add Note")').click();

    // Note modal should open
    const noteModal = page.locator('#noteModal');
    await expect(noteModal).toHaveClass(/active/);

    // Enter note
    const noteTextarea = page.locator('#noteTextarea');
    await noteTextarea.fill('Important strategic note');
    await page.locator('#noteModal button.primary').click();

    // Modal should close
    await expect(noteModal).not.toHaveClass(/active/);

    // Note badge should appear
    const noteBadge = node.locator('.node-note-badge');
    await expect(noteBadge).toBeVisible();

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.nodes[0].note).toBe('Important strategic note');
  });
});

// ============================================================================
// TEST SUITE: EVOLUTION & CONNECTIONS
// ============================================================================

test.describe('Evolution & Connections', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('2.1.1: Enable Evolution', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponent('Evolving', 'genesis');

    const node = await wardley.getCanvasNode('Evolving');
    await node.hover();
    await node.locator('button:has-text("Evolve")').click();

    // Evolution arrow should appear
    const arrow = page.locator('.evolution-arrow');
    await expect(arrow).toBeVisible();

    // Label should appear
    const label = page.locator('.evolution-label:has-text("evolving")');
    await expect(label).toBeVisible();

    // Stage badge should show evolution
    const stageBadge = node.locator('.node-stage');
    const text = await stageBadge.textContent();
    expect(text).toContain('→');

    // Button should change
    await node.hover();
    await expect(node.locator('button:has-text("✓ Evolving")')).toBeVisible();

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.nodes[0].evolving).toBe(true);
    expect(data.nodes[0].evolvingTo).toBe('custom');
    expect(data.nodes[0].evolutionTargetX).toBeDefined();
  });

  test('2.1.2: Drag Evolution Arrow', async ({ page }) => {
    // CONFIDENCE: LOW - SVG dragging is complex and may be unreliable
    // This test may need manual verification
    await wardley.addComponent('Evolving', 'genesis');

    const node = await wardley.getCanvasNode('Evolving');
    await node.hover();
    await node.locator('button:has-text("Evolve")').click();

    const arrow = page.locator('.evolution-arrow').first();

    // Get initial arrow endpoint
    const initialX2 = await arrow.getAttribute('x2');

    // Try to drag arrow (this may be flaky)
    const arrowBox = await arrow.boundingBox();
    if (arrowBox) {
      await page.mouse.move(arrowBox.x + arrowBox.width, arrowBox.y + arrowBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(arrowBox.x + arrowBox.width + 200, arrowBox.y + arrowBox.height / 2, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);

      // Arrow should have moved
      const finalX2 = await arrow.getAttribute('x2');
      expect(parseFloat(finalX2)).not.toBe(parseFloat(initialX2));
    }
  });

  test('2.1.3: Evolution Arrow Follows Component Vertically', async ({ page }) => {
    // CONFIDENCE: MEDIUM
    await wardley.addComponent('Evolving', 'genesis');

    const node = await wardley.getCanvasNode('Evolving');
    await node.hover();
    await node.locator('button:has-text("Evolve")').click();

    const arrow = page.locator('.evolution-arrow').first();
    const initialY = await arrow.getAttribute('y1');

    // Drag component vertically
    await wardley.dragElement(node, 0, 200);
    await page.waitForTimeout(500);

    // Arrow Y position should have changed
    const finalY = await arrow.getAttribute('y1');
    expect(parseFloat(finalY)).not.toBe(parseFloat(initialY));
  });

  test('2.1.5: Disable Evolution', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponent('Evolving', 'genesis');

    const node = await wardley.getCanvasNode('Evolving');
    await node.hover();
    await node.locator('button:has-text("Evolve")').click();

    // Evolution enabled
    await expect(page.locator('.evolution-arrow')).toBeVisible();

    // Click again to disable
    await node.hover();
    await node.locator('button:has-text("✓ Evolving")').click();

    // Arrow should disappear
    await expect(page.locator('.evolution-arrow')).not.toBeVisible();

    // Button should reset
    await node.hover();
    await expect(node.locator('button:has-text("Evolve")')).toBeVisible();
  });

  test('2.2.1: Create Connection', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponent('Component A', 'genesis');
    await wardley.addComponent('Component B', 'custom');

    const nodeA = await wardley.getCanvasNode('Component A');
    const nodeB = await wardley.getCanvasNode('Component B');

    // Start connection from A
    await nodeA.hover();
    await nodeA.locator('button:has-text("Connect")').click();

    // Connection mode indicator should appear
    const indicator = page.locator('#connectionModeIndicator');
    await expect(indicator).toBeVisible();

    // Click on B
    await nodeB.click();

    // Connection line should appear
    const connection = page.locator('.connection-line');
    await expect(connection).toBeVisible();

    // Indicator should disappear
    await expect(indicator).not.toBeVisible();

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.connections).toHaveLength(1);
    expect(data.connections[0].from).toBe(0);
    expect(data.connections[0].to).toBe(1);
  });

  test('2.2.2: Connection Follows Components', async ({ page }) => {
    // CONFIDENCE: MEDIUM - Path updates may be timing-dependent
    await wardley.addComponent('Component A', 'genesis');
    await wardley.addComponent('Component B', 'custom');

    const nodeA = await wardley.getCanvasNode('Component A');
    const nodeB = await wardley.getCanvasNode('Component B');

    // Create connection
    await nodeA.hover();
    await nodeA.locator('button:has-text("Connect")').click();
    await nodeB.click();

    const connection = page.locator('.connection-line').first();
    const initialPath = await connection.getAttribute('d');

    // Drag component A
    await wardley.dragElement(nodeA, 300, 100);
    await page.waitForTimeout(500);

    // Connection path should have changed
    const finalPath = await connection.getAttribute('d');
    expect(finalPath).not.toBe(initialPath);
  });
});

// ============================================================================
// TEST SUITE: CANVAS NAVIGATION
// ============================================================================

test.describe('Canvas Navigation', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('3.1.1: Pan with Space+Drag', async ({ page }) => {
    // CONFIDENCE: MEDIUM - Keyboard + mouse combo can be tricky
    await wardley.addComponent('Reference', 'custom');

    const node = await wardley.getCanvasNode('Reference');
    const initialBox = await node.boundingBox();

    // Pan canvas
    await wardley.panCanvas(200, 100);
    await page.waitForTimeout(500);

    const finalBox = await node.boundingBox();

    // Component should appear to have moved (canvas panned)
    expect(finalBox.x).not.toBe(initialBox.x);
    expect(finalBox.y).not.toBe(initialBox.y);
  });

  test('3.1.3: Pan Boundary - Left Edge', async ({ page }) => {
    // CONFIDENCE: MEDIUM
    await wardley.addComponent('Reference', 'custom');

    // Try to pan far left (past boundary)
    await wardley.panCanvas(-2000, 0);
    await page.waitForTimeout(500);

    // Genesis zone should still be visible (can't pan past left edge)
    const genesisZone = page.locator('.evolution-zone[data-stage="genesis"]');
    await expect(genesisZone).toBeVisible();

    // Check that we hit the boundary
    const canvasContent = wardley.canvasContent;
    const transform = await canvasContent.evaluate(el => el.style.transform);
    expect(transform).toContain('translate(0px'); // X should be 0 or positive
  });

  test('3.2.1: Zoom with Scroll Wheel', async ({ page }) => {
    // CONFIDENCE: LOW - Wheel events are difficult to simulate reliably
    // May need manual verification
    await wardley.addComponent('Reference', 'custom');

    const canvas = wardley.canvas;
    const box = await canvas.boundingBox();

    // Scroll up (zoom in)
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(300);

    // Check zoom level increased
    let zoomText = await wardley.zoomLevel.textContent();
    expect(parseInt(zoomText)).toBeGreaterThan(100);

    // Scroll down (zoom out)
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(300);

    zoomText = await wardley.zoomLevel.textContent();
    // Should be back closer to 100
  });

  test('3.2.2: Zoom with Buttons', async ({ page }) => {
    // CONFIDENCE: HIGH

    // Zoom in
    await wardley.zoom('in', 2);
    let zoomText = await wardley.zoomLevel.textContent();
    expect(parseInt(zoomText)).toBeGreaterThan(100);

    // Zoom out
    await wardley.zoom('out', 2);
    zoomText = await wardley.zoomLevel.textContent();
    expect(parseInt(zoomText)).toBe(100);

    // Zoom in again
    await wardley.zoom('in', 3);
    zoomText = await wardley.zoomLevel.textContent();
    expect(parseInt(zoomText)).toBeGreaterThan(100);

    // Reset
    await wardley.zoom('reset');
    zoomText = await wardley.zoomLevel.textContent();
    expect(parseInt(zoomText)).toBe(100);
  });

  test('3.2.4: Zoom Limits', async ({ page }) => {
    // CONFIDENCE: HIGH

    // Zoom in to max
    await wardley.zoom('in', 20); // Way more than needed
    let zoomText = await wardley.zoomLevel.textContent();
    expect(parseInt(zoomText)).toBeLessThanOrEqual(300);

    // Reset
    await wardley.zoom('reset');

    // Zoom out to min
    await wardley.zoom('out', 20);
    zoomText = await wardley.zoomLevel.textContent();
    expect(parseInt(zoomText)).toBeGreaterThanOrEqual(30);
  });

  test('3.3.1: Labels Visible at 100% Zoom', async ({ page }) => {
    // CONFIDENCE: HIGH

    // Check all four labels visible
    await expect(page.locator('.evolution-zone-label:has-text("Genesis")')).toBeVisible();
    await expect(page.locator('.evolution-zone-label:has-text("Custom-Built")')).toBeVisible();
    await expect(page.locator('.evolution-zone-label:has-text("Product")')).toBeVisible();
    await expect(page.locator('.evolution-zone-label:has-text("Commodity")')).toBeVisible();
  });

  test('3.3.2: Labels Visible at 50% Zoom', async ({ page }) => {
    // CONFIDENCE: MEDIUM
    await wardley.zoom('out', 5);

    // Labels should still be visible
    await expect(page.locator('.evolution-zone-label:has-text("Genesis")')).toBeVisible();
    await expect(page.locator('.evolution-zone-label:has-text("Custom-Built")')).toBeVisible();
  });
});

// ============================================================================
// TEST SUITE: STRATEGIC ZONES
// ============================================================================

test.describe('Strategic Zones', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('4.1.1: Add Opportunity Zone', async ({ page }) => {
    // CONFIDENCE: HIGH
    await page.locator('button.toolbar-btn:has-text("💡 Opportunity")').first().click();

    // Zone should appear
    const zone = page.locator('.annotation-zone.opportunity');
    await expect(zone).toBeVisible();

    // Check default size
    const box = await zone.boundingBox();
    expect(box.width).toBeGreaterThan(200); // Approximately 300px
    expect(box.height).toBeGreaterThan(150); // Approximately 200px

    // Label should be visible
    await expect(zone.locator('.annotation-zone-label')).toHaveText('opportunity');

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.zones).toHaveLength(1);
    expect(data.zones[0].type).toBe('opportunity');
  });

  test('4.1.2: Add All Zone Types', async ({ page }) => {
    // CONFIDENCE: HIGH
    const zoneTypes = [
      { emoji: '💡', name: 'Opportunity', class: 'opportunity' },
      { emoji: '⚠️', name: 'Inertia', class: 'inertia' },
      { emoji: '🚨', name: 'Threat', class: 'threat' },
      { emoji: '⚔️', name: 'War', class: 'war' },
      { emoji: '📝', name: 'Note', class: 'note' }
    ];

    for (const zone of zoneTypes) {
      await page.locator(`button.toolbar-btn:has-text("${zone.emoji} ${zone.name}")`).click();
      await page.waitForTimeout(200);
    }

    // All zones should be visible
    for (const zone of zoneTypes) {
      const zoneEl = page.locator(`.annotation-zone.${zone.class}`);
      await expect(zoneEl).toBeVisible();
    }

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.zones).toHaveLength(5);
  });

  test('4.2.1: Drag Zone', async ({ page }) => {
    // CONFIDENCE: MEDIUM
    await page.locator('button.toolbar-btn:has-text("💡 Opportunity")').first().click();

    const zone = page.locator('.annotation-zone.opportunity');
    const initialBox = await zone.boundingBox();

    // Drag zone
    await wardley.dragElement(zone, 300, 200);
    await page.waitForTimeout(500);

    const finalBox = await zone.boundingBox();

    // Zone should have moved
    expect(finalBox.x).not.toBe(initialBox.x);
    expect(finalBox.y).not.toBe(initialBox.y);
  });

  test('4.2.2: Resize Zone - Southeast Corner', async ({ page }) => {
    // CONFIDENCE: LOW - Resize handles are small and may be difficult to target
    await page.locator('button.toolbar-btn:has-text("💡 Opportunity")').first().click();

    const zone = page.locator('.annotation-zone.opportunity');

    // Hover to show handles
    await zone.hover();
    await page.waitForTimeout(300);

    // Try to get SE handle
    const handle = zone.locator('.zone-resize-handle.se');
    await expect(handle).toBeVisible();

    const initialBox = await zone.boundingBox();

    // Drag handle
    await wardley.dragElement(handle, 100, 100);
    await page.waitForTimeout(500);

    const finalBox = await zone.boundingBox();

    // Zone should be larger
    expect(finalBox.width).toBeGreaterThan(initialBox.width);
    expect(finalBox.height).toBeGreaterThan(initialBox.height);
  });

  test('4.2.6: Delete Zone', async ({ page }) => {
    // CONFIDENCE: HIGH
    await page.locator('button.toolbar-btn:has-text("💡 Opportunity")').first().click();

    const zone = page.locator('.annotation-zone.opportunity');
    await zone.hover();

    const deleteBtn = zone.locator('button.zone-delete-btn');
    await deleteBtn.click();

    // Zone should disappear
    await expect(zone).not.toBeVisible();

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.zones).toHaveLength(0);
  });

  test('4.3.1: Add Note to Zone', async ({ page }) => {
    // CONFIDENCE: HIGH
    await page.locator('button.toolbar-btn:has-text("💡 Opportunity")').first().click();

    const zone = page.locator('.annotation-zone.opportunity');

    // Double-click to add note
    await zone.dblclick();

    // Note modal should open
    const noteModal = page.locator('#noteModal');
    await expect(noteModal).toHaveClass(/active/);

    // Enter note
    await page.locator('#noteTextarea').fill('Strategic opportunity zone note');
    await page.locator('#noteModal button.primary').click();

    // Note badge should appear
    const badge = zone.locator('.zone-note-badge');
    await expect(badge).toBeVisible();

    // Check localStorage
    const data = await wardley.getLocalStorageData();
    expect(data.zones[0].note).toBe('Strategic opportunity zone note');
  });
});

// ============================================================================
// TEST SUITE: AI COACH
// ============================================================================

test.describe('AI Coach', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('5.1.1: Open/Close AI Coach', async ({ page }) => {
    // CONFIDENCE: HIGH

    // Initially collapsed
    const coachPanel = page.locator('#aiCoachPanel');
    await expect(coachPanel).toHaveClass(/collapsed/);

    // Open
    await wardley.aiCoachButton.click();
    await page.waitForTimeout(300);
    await expect(coachPanel).not.toHaveClass(/collapsed/);

    // Button should be active
    await expect(wardley.aiCoachButton).toHaveClass(/active/);

    // Close
    await wardley.aiCoachButton.click();
    await page.waitForTimeout(300);
    await expect(coachPanel).toHaveClass(/collapsed/);
  });

  test('5.1.2: AI Coach Default State', async ({ page }) => {
    // CONFIDENCE: HIGH
    const coachPanel = page.locator('#aiCoachPanel');
    await expect(coachPanel).toHaveClass(/collapsed/);
  });

  test('5.1.3: Send Message to AI', async ({ page }) => {
    // CONFIDENCE: MEDIUM - Depends on backend being available
    // This test will FAIL if backend is not running
    await wardley.aiCoachButton.click();

    const input = page.locator('#coachInput');
    await input.fill('Hello AI');
    await page.locator('.coach-send-btn').click();

    // Loading indicator should appear
    const loading = page.locator('#coachLoading');
    await expect(loading).toBeVisible();

    // Wait for response (with generous timeout)
    await page.waitForTimeout(10000);

    // Response should appear in chat
    const messages = page.locator('.coach-message');
    await expect(messages).toHaveCount(2); // User + assistant

    // Check localStorage saved
    const chatData = await page.evaluate(() => {
      const data = localStorage.getItem('wardleyMapCoachMessages');
      return data ? JSON.parse(data) : null;
    });
    expect(chatData).toBeTruthy();
    expect(chatData.length).toBeGreaterThanOrEqual(2);
  });

  test('5.1.4: Quick Prompts', async ({ page }) => {
    // CONFIDENCE: MEDIUM - Depends on backend
    await wardley.aiCoachButton.click();

    const quickPrompt = page.locator('.quick-prompt').first();
    await quickPrompt.click();

    // Should auto-send and show response
    await page.waitForTimeout(10000);

    const messages = page.locator('.coach-message');
    await expect(messages.count()).resolves.toBeGreaterThanOrEqual(2);
  });

  test('5.3.3: Empty Message', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.aiCoachButton.click();

    const messageCountBefore = await page.locator('.coach-message').count();

    // Try to send empty message
    await page.locator('.coach-send-btn').click();

    // No new message should appear
    const messageCountAfter = await page.locator('.coach-message').count();
    expect(messageCountAfter).toBe(messageCountBefore);
  });
});

// ============================================================================
// TEST SUITE: DATA PERSISTENCE
// ============================================================================

test.describe('Data Persistence', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('6.1.1: Auto-Save on Action', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponent('Test Component', 'custom');

    // Check localStorage immediately
    const data = await wardley.getLocalStorageData();
    expect(data).toBeTruthy();
    expect(data.nodes).toHaveLength(1);
    expect(data.nodes[0].label).toBe('Test Component');
  });

  test('6.1.2: Restore on Page Load', async ({ page }) => {
    // CONFIDENCE: HIGH

    // Add components
    await wardley.addComponent('Component A', 'genesis');
    await wardley.addComponent('Component B', 'custom');

    // Add zone
    await page.locator('button.toolbar-btn:has-text("💡 Opportunity")').first().click();

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Components should be restored
    await expect(wardley.getCanvasNode('Component A')).toBeVisible();
    await expect(wardley.getCanvasNode('Component B')).toBeVisible();

    // Zone should be restored
    await expect(page.locator('.annotation-zone.opportunity')).toBeVisible();

    // Count should be correct
    await expect(wardley.componentCount).toHaveText('2');
  });

  test('6.2.1: Export Map', async ({ page }) => {
    // CONFIDENCE: HIGH

    // Create map
    await wardley.addComponent('Export Test', 'custom');

    // Export
    await wardley.exportButton.click();

    const exportModal = page.locator('#exportModal');
    await expect(exportModal).toHaveClass(/active/);

    // Check JSON content
    const exportData = await page.locator('#exportData').inputValue();
    const json = JSON.parse(exportData);

    expect(json.nodes).toHaveLength(1);
    expect(json.nodes[0].label).toBe('Export Test');
    expect(json.connections).toBeDefined();
    expect(json.zones).toBeDefined();
  });

  test('6.2.4: Import Valid Map', async ({ page }) => {
    // CONFIDENCE: HIGH

    const validJSON = JSON.stringify({
      nodes: [
        { id: 0, label: 'Imported Component', x: 300, y: 200, stage: 'product' }
      ],
      connections: [],
      zones: []
    });

    // Import
    await wardley.importButton.click();
    await page.locator('#importData').fill(validJSON);
    await page.locator('#importModal button.primary').click();

    // Component should appear
    await expect(wardley.getCanvasNode('Imported Component')).toBeVisible();

    // Check count
    await expect(wardley.componentCount).toHaveText('1');
  });

  test('6.2.5: Import Invalid JSON', async ({ page }) => {
    // CONFIDENCE: HIGH

    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Invalid JSON');
      await dialog.accept();
    });

    await wardley.importButton.click();
    await page.locator('#importData').fill('{ invalid json }');
    await page.locator('#importModal button.primary').click();

    // Modal should stay open
    await expect(page.locator('#importModal')).toHaveClass(/active/);
  });
});

// ============================================================================
// TEST SUITE: MODALS & UI
// ============================================================================

test.describe('Modals & UI', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('7.1.1: Help Modal', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.helpButton.click();

    const helpModal = page.locator('#helpModal');
    await expect(helpModal).toHaveClass(/active/);

    // Check for content sections
    await expect(helpModal).toContainText('Getting Started');
    await expect(helpModal).toContainText('Controls');
    await expect(helpModal).toContainText('Component Actions');
    await expect(helpModal).toContainText('Strategic Zones');
    await expect(helpModal).toContainText('AI Strategy Coach');

    // Close
    await page.locator('#helpModal button:has-text("Close")').click();
    await expect(helpModal).not.toHaveClass(/active/);
  });

  test('7.1.2: Add Component Modal Focus', async ({ page }) => {
    // CONFIDENCE: HIGH
    await wardley.addComponentButton.click();

    // Input should be focused
    const activeElement = await page.evaluate(() => document.activeElement.id);
    expect(activeElement).toBe('newComponentName');
  });

  test('7.2.1: Empty State', async ({ page }) => {
    // CONFIDENCE: HIGH

    // Should show empty state
    await expect(wardley.componentCount).toHaveText('0');
    await expect(wardley.componentList).toContainText('Click "➕ Add Component"');
  });

  test('7.2.2: Populated List', async ({ page }) => {
    // CONFIDENCE: HIGH

    const components = [
      { name: 'Alpha', stage: 'genesis' },
      { name: 'Beta', stage: 'custom' },
      { name: 'Gamma', stage: 'product' },
      { name: 'Delta', stage: 'commodity' }
    ];

    for (const comp of components) {
      await wardley.addComponent(comp.name, comp.stage);
    }

    await expect(wardley.componentCount).toHaveText('4');

    // Each should have stage badge
    for (const comp of components) {
      const item = await wardley.getComponentInList(comp.name);
      await expect(item).toBeVisible();
      await expect(item.locator('.stage-badge')).toContainText(comp.stage);
    }
  });
});

// ============================================================================
// TEST SUITE: EDGE CASES
// ============================================================================

test.describe('Edge Cases', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('8.1.2: Very Long Component Names', async ({ page }) => {
    // CONFIDENCE: HIGH
    const longName = 'A'.repeat(200);

    await wardley.addComponent(longName, 'custom');

    const node = await wardley.getCanvasNode(longName);
    await expect(node).toBeVisible();

    // Should not break layout
    const box = await node.boundingBox();
    expect(box.width).toBeLessThan(400); // Should have reasonable width
  });

  test('8.1.3: Special Characters in Names', async ({ page }) => {
    // CONFIDENCE: HIGH
    const specialName = "Test<>&'\"Component";

    await wardley.addComponent(specialName, 'custom');

    // Should display correctly (escaped)
    const node = await wardley.getCanvasNode(specialName);
    await expect(node).toBeVisible();
  });

  test('8.3.2: Multiple Rapid Actions', async ({ page }) => {
    // CONFIDENCE: MEDIUM - Timing-dependent

    // Rapidly add components
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(wardley.addComponent(`Component ${i}`, 'custom'));
    }
    await Promise.all(promises);

    // All should be created
    await expect(wardley.componentCount).toHaveText('10');

    // No duplicate IDs
    const data = await wardley.getLocalStorageData();
    const ids = data.nodes.map(n => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// ============================================================================
// TEST SUITE: REGRESSION (Critical Path)
// ============================================================================

test.describe('Regression: Critical Path', () => {
  let wardley;

  test.beforeEach(async ({ page }) => {
    wardley = new WardleyMapperPage(page);
    await wardley.clearLocalStorage();
    await wardley.goto();
  });

  test('CRITICAL PATH: Full User Journey', async ({ page }) => {
    // CONFIDENCE: HIGH
    // This test simulates a complete user journey

    // 1. Add components
    await wardley.addComponent('User Needs', 'custom');
    await wardley.addComponent('Web App', 'product');
    await wardley.addComponent('Database', 'commodity');

    // 2. Create connections
    const userNeeds = await wardley.getCanvasNode('User Needs');
    const webApp = await wardley.getCanvasNode('Web App');

    await userNeeds.hover();
    await userNeeds.locator('button:has-text("Connect")').click();
    await webApp.click();

    // 3. Enable evolution
    await userNeeds.hover();
    await userNeeds.locator('button:has-text("Evolve")').click();

    // 4. Add zone
    await page.locator('button.toolbar-btn:has-text("💡 Opportunity")').first().click();

    // 5. Pan and zoom
    await wardley.zoom('in', 2);
    await wardley.panCanvas(100, 50);

    // 6. Export
    await wardley.exportButton.click();
    const exportData = await page.locator('#exportData').inputValue();
    const json = JSON.parse(exportData);
    await page.locator('#exportModal button:has-text("Close")').click();

    // 7. Clear and import
    page.on('dialog', async dialog => await dialog.accept());
    await wardley.clearButton.click();
    await page.waitForTimeout(500);

    await wardley.importButton.click();
    await page.locator('#importData').fill(exportData);
    await page.locator('#importModal button.primary').click();

    // 8. Verify everything restored
    await expect(wardley.componentCount).toHaveText('3');
    await expect(wardley.getCanvasNode('User Needs')).toBeVisible();
    await expect(page.locator('.connection-line')).toBeVisible();
    await expect(page.locator('.evolution-arrow')).toBeVisible();
    await expect(page.locator('.annotation-zone.opportunity')).toBeVisible();

    // 9. Refresh and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(wardley.componentCount).toHaveText('3');
    await expect(wardley.getCanvasNode('User Needs')).toBeVisible();
  });
});
