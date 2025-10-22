# To-Do List App 📝

<div align="center">
  <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" alt="Cat typing on computer">
  <br>
  <em>When you're coding at 3 AM and still going strong! 😺</em>
</div>

<br>

A clean, responsive to-do list application built with vanilla JavaScript, HTML, and CSS. Features persistent storage, inline editing, and a modern, accessible UI.

![To-Do List App](https://img.shields.io/badge/vanilla-JavaScript-yellow) ![HTML5](https://img.shields.io/badge/HTML-5-orange) ![CSS3](https://img.shields.io/badge/CSS-3-blue)

## Features

✅ **Add Tasks** - Quick task entry via input field or Enter key  
✏️ **Edit Tasks** - Inline editing with Enter to save, Esc to cancel  
🗑️ **Delete Tasks** - Remove tasks with confirmation prompt  
💾 **Persistent Storage** - All tasks saved to localStorage  
📱 **Responsive Design** - Mobile-first, works on all screen sizes  
♿ **Accessible** - ARIA labels, keyboard navigation, focus management  
🎨 **Modern UI** - Clean design with smooth animations

## Quick Start

<img src="https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif" width="200" align="right" alt="Excited cat">

### Local Development

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Start adding tasks!**

No build process or dependencies required - just open and use.

<br clear="right">

### GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings** → **Pages**
3. Select **main** branch as source
4. Your app will be live at `https://[username].github.io/To-Do-List/`

## Project Structure

```
To-Do-List/
├── index.html      # Main HTML structure
├── style.css       # Styles and responsive design
├── app.js          # Application logic and localStorage
└── README.md       # Documentation
```

## Technical Specifications

### Task Model
```javascript
{
  id: string,           // Unique identifier (timestamp + random)
  title: string,        // Task description
  createdAt: string     // ISO 8601 timestamp
}
```

### localStorage Key
- **Key**: `todo:v1:tasks`
- **Format**: JSON array of task objects

### Core Functions

- `load()` - Initialize tasks from localStorage
- `save()` - Persist tasks to localStorage
- `render()` - Update DOM with current tasks
- `addTask(title)` - Create new task
- `editTask(id, newTitle)` - Update existing task
- `deleteTask(id)` - Remove task with confirmation

## Usage Guide

<div align="center">
  <img src="https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif" width="250" alt="Cat working on laptop">
  <br>
  <em>Me organizing my life with this app 🐱</em>
</div>

<br>

### Adding Tasks
1. Type your task in the input field
2. Click **Add** or press **Enter**
3. Task appears at the top of the list

### Editing Tasks
1. Click the **edit icon** (pencil) or click on the task text
2. Modify the text in the input field
3. Press **Enter** or click outside to save
4. Press **Esc** to cancel

### Deleting Tasks
1. Click the **delete icon** (trash)
2. Confirm deletion in the prompt
3. Task is removed with animation

<div align="center">
  <img src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" width="200" alt="Cat celebrating">
  <br>
  <em>When you finally complete all your tasks! 🎉</em>
</div>

<br>

### Keyboard Navigation
- **Tab** - Navigate between elements
- **Enter** - Submit form or save edit
- **Esc** - Cancel editing

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires ES6+ support and localStorage API.

## Customization

### Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #4a90e2;
    --danger-color: #e74c3c;
    --text-primary: #2c3e50;
    /* ... more variables */
}
```

### Storage Key
Change in `app.js`:
```javascript
const STORAGE_KEY = 'todo:v1:tasks';
```

### Validation Rules
Modify in `app.js`:
```javascript
if (trimmedTitle.length > 500) {
    // Adjust max length
}
```

## Features in Detail

### Input Validation
- Trims whitespace automatically
- Prevents empty tasks
- Shows inline error messages
- Visual feedback with shake animation

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus-visible styles
- Screen reader friendly

### Responsive Design
- Mobile-first approach
- Breakpoints at 480px and 768px
- Touch-friendly buttons
- Optimized for all screen sizes

### Animations
- Smooth slide-in for new tasks
- Fade-out on deletion
- Shake on validation error
- Subtle hover effects

## Data Persistence

Tasks are automatically saved to `localStorage` after every change:
- Adding a task
- Editing a task
- Deleting a task

Data persists across:
- Page refreshes
- Browser restarts
- Tab closures

**Note**: Clearing browser data will remove all tasks.

## Performance

- Lightweight (~10KB total)
- No external dependencies
- Instant load time
- Efficient DOM updates
- Event delegation for scalability

## Security

- XSS protection via HTML escaping
- No external API calls
- Client-side only (no server)
- Safe localStorage usage

## License

MIT License - Feel free to use for personal or commercial projects.

## Contributing

Suggestions and improvements welcome! This is a learning project demonstrating vanilla JavaScript best practices.

<div align="center">
  <img src="https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif" width="250" alt="Cat with glasses coding">
  <br>
  <em>Ready to contribute? Let's code together! 😸</em>
</div>

---

<div align="center">
  <img src="https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif" width="150" alt="Typing cat">
  <br>
  <strong>Built with ❤️ using vanilla JavaScript</strong>
  <br>
  <em>No cats were harmed in the making of this app 🐾</em>
</div>
