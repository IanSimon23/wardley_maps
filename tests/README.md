# Wardley Mapper

A modern, intuitive web-based tool for creating and analyzing Wardley Maps - strategic visual representations of your business landscape and value chains.

![Version](https://img.shields.io/badge/version-2.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 What is Wardley Mapping?

Wardley Mapping is a strategic planning technique created by Simon Wardley that helps organizations:
- Visualize their value chain and competitive landscape
- Understand component evolution (Genesis → Custom → Product → Commodity)
- Make better strategic decisions about where to innovate, optimize, or partner
- Identify inertia, opportunities, and competitive dynamics

## ✨ Features

### Core Mapping (v1.0)
- **Drag & Drop Interface** - Position components freely on the canvas
- **Four Evolution Stages** - Genesis, Custom-Built, Product, Commodity with visual zones
- **Value Chain Dependencies** - Connect components to show relationships
- **Auto-Save** - Everything persists in browser localStorage
- **Export/Import** - Save and share maps as JSON

### Evolution Visualization (v2.0)
- **Evolution Arrows** - Show components moving between stages
- **Strategic Indicators** - Visual representation of component evolution over time
- **Stage Auto-Detection** - Components automatically detect their stage based on position

### AI Strategy Coach (v2.1)
- **Context-Aware Analysis** - AI understands your complete map structure
- **Strategic Guidance** - Get insights on opportunities, risks, and gameplay
- **Interactive Chat** - Ask questions about Wardley mapping concepts
- **Quick Prompts** - Pre-built questions for common strategic analyses
- **Persistent Conversations** - Chat history saves across sessions

**Note:** AI Coach requires Anthropic API access and currently works within Claude.ai artifacts. See [Deployment](#deployment) for public deployment options.

### Component Notes (v2.2)
- **Rich Context** - Add notes to any component
- **Visual Indicators** - 💭 Badge shows components with notes
- **Strategic Documentation** - Capture assumptions, risks, rationale, and insights
- **AI Integration** - Notes are included in AI coach context for better analysis

## 🚀 Quick Start

### Use in Claude.ai (Recommended)
1. Open the `wardley-mapper.html` file in Claude.ai as an artifact
2. Start mapping immediately - full AI coach functionality included
3. All features work out of the box

### Use Locally
1. Download `wardley-mapper.html`
2. Open in any modern web browser
3. Start creating your Wardley Map
4. **Note:** AI Coach will not work locally (requires backend - see [Deployment](#deployment))

## 📖 How to Use

### Creating Components
1. Enter a component name in the sidebar
2. Click "Add to Canvas" or press Enter
3. Drag the component to position it on the map

### Positioning Strategy
- **Y-axis (vertical):** Value Chain - higher = more visible to user
- **X-axis (horizontal):** Evolution stage - left (Genesis) to right (Commodity)

### Evolution Stages
- **Genesis** - Novel, uncertain, rare, rapidly changing
- **Custom-Built** - Bespoke solutions, understood by few
- **Product** - Standardized offerings, widespread understanding
- **Commodity** - Ubiquitous, taken for granted, highly evolved

### Showing Evolution
1. Hover over a component
2. Click "Evolve" button
3. An arrow shows the component's strategic movement

### Adding Notes
1. Hover over a component
2. Click "Add Note" or click the 💭 badge
3. Document assumptions, risks, metrics, or strategic context

### Connecting Components
1. Click "Connect" on a component
2. Click another component to create a dependency
3. Arrows show value chain relationships

### Using the AI Coach
1. Click "🤖 AI Coach" in the header
2. Use quick prompts or ask your own questions
3. AI analyzes your map structure and provides strategic insights

## 🎨 Design Philosophy

Built with a **refined strategic aesthetic**:
- Dark theme optimized for long strategy sessions
- Custom typography (Fraunces + DM Sans)
- Smooth interactions and micro-animations
- Professional visual hierarchy
- Color-coded evolution stages

## 🛠️ Technology Stack

- **Pure Vanilla JavaScript** - No frameworks, no dependencies
- **Single HTML File** - Self-contained and portable
- **CSS Variables** - Consistent theming
- **LocalStorage** - Client-side persistence
- **SVG** - Scalable connection rendering
- **Anthropic API** - Claude Sonnet 4 for AI coaching (when available)

## 📋 Roadmap

### v2.3 - Strategic Annotations (Planned)
- [ ] Freeform text annotations on canvas
- [ ] Strategic zones (Opportunity, Inertia, War, etc.)
- [ ] Visual markers for patterns and gameplay
- [ ] Annotation layers

### Future Enhancements
- [ ] Multiple map support
- [ ] Collaboration features
- [ ] Map templates library
- [ ] Presentation mode
- [ ] Advanced export options (PNG, PDF)

## 🚢 Deployment

### Option 1: Claude.ai Only (Current)
Works perfectly within Claude.ai artifacts with full AI functionality.

### Option 2: Static Hosting (Without AI Coach)
Deploy to GitHub Pages, Netlify, or Vercel:
- All mapping features work
- Notes and evolution work
- AI Coach will be disabled

### Option 3: With Backend (Future)
Add a simple backend proxy to enable AI Coach:
- AWS Lambda / Cloudflare Workers
- Handles API key securely
- Forwards requests to Anthropic API

### Option 4: User-Provided API Keys
Users can paste their own Anthropic API key in settings (future feature).

## 📝 Export Format

Maps export as JSON:
```json
{
  "nodes": [
    {
      "id": 0,
      "label": "Component Name",
      "x": 200,
      "y": 100,
      "stage": "custom",
      "evolving": true,
      "evolvingTo": "product",
      "note": "Strategic context here"
    }
  ],
  "connections": [
    { "from": 0, "to": 1 }
  ]
}
```

## 🤝 Contributing

This project is part of exploring practical AI integration in strategy tools. Contributions welcome!

Areas of interest:
- Strategic annotation features (v2.3)
- Backend proxy implementation for AI coach
- Export format enhancements
- Mobile/touch optimization
- Wardley mapping pattern library

## 📚 Learn More About Wardley Mapping

- [Wardley Maps Book](https://medium.com/wardleymaps) by Simon Wardley
- [Learn Wardley Mapping](https://learnwardleymapping.com/)
- [Mapping Community](https://github.com/wardley-maps-community/awesome-wardley-maps)

## 🙏 Acknowledgments

- **Simon Wardley** - Creator of Wardley Mapping
- Built with **vibe coding** - rapid iteration with AI assistance
- Designed for the **agile community** - practitioners who value visual strategy

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🐛 Known Issues

- Evolution arrows shift slightly when AI Coach panel toggles (cosmetic only)
- AI Coach requires Claude.ai environment or backend proxy

## 💬 Feedback

Found a bug? Have a feature request? Open an issue or contribute!

---

**Repository Description (for GitHub):**
> Modern Wardley Mapping tool with AI strategy coach. Drag-and-drop interface for creating strategic maps, visualizing component evolution, and getting AI-powered strategic insights. Built for agile practitioners and strategy teams.

**Topics/Tags:**
`wardley-mapping` `strategy` `visualization` `agile` `ai-coach` `strategic-planning` `value-chain` `business-strategy` `vanilla-javascript` `single-page-app`
