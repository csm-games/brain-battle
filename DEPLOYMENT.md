# 🚀 GitHub Pages Deployment Guide

## Quick Setup

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name: `brain-battle-game` (or your preference)
4. Description: "Educational card game teaching cognitive behavioral concepts"
5. Make it **Public** (required for free GitHub Pages)
6. Don't initialize with README (we have files to upload)
7. Click "Create repository"

### 2. Upload Files
**Option A: Using GitHub Web Interface**
1. In your new repository, click "uploading an existing file"
2. Drag and drop all files from your project folder:
   - `index.html`
   - `demo.html`
   - `game.js`
   - `styles.css`
   - `package.json`
   - `README.md`
   - `images/` folder (with all subfolders)
3. Add commit message: "Initial commit - Brain Battle game"
4. Click "Commit changes"

**Option B: Using Git Command Line**
```bash
# Navigate to your project folder
cd brain-battle-updated

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Brain Battle game"

# Add remote repository (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/brain-battle-game.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select "Deploy from a branch"
5. Select **main** branch and **/ (root)** folder
6. Click **Save**
7. Wait 2-3 minutes for deployment

### 4. Access Your Game
Your game will be available at:
```
https://yourusername.github.io/brain-battle-game/
```

## 🔧 Customization

### Update Repository URLs
In `package.json`, replace `yourusername` with your actual GitHub username:
```json
{
  "repository": {
    "url": "https://github.com/YOURUSERNAME/brain-battle-game.git"
  },
  "homepage": "https://YOURUSERNAME.github.io/brain-battle-game/"
}
```

### Update README
In `README.md`, update the play link:
```markdown
**[Play Brain Battle Series](https://YOURUSERNAME.github.io/brain-battle-game/)**
```

## 🎯 Testing Your Deployment

1. **Visit your GitHub Pages URL**
2. **Test both game modes:**
   - Brain Battle
   - Tricky Tech
3. **Verify all features work:**
   - Card dragging
   - Sound effects
   - Game timer
   - Win conditions
4. **Test on mobile devices**

## 🔄 Updating Your Game

After making changes to your local files:

**Using Git Command Line:**
```bash
git add .
git commit -m "Update game features"
git push origin main
```

**Using GitHub Web Interface:**
1. Edit files directly on GitHub, or
2. Upload new versions of changed files

Changes will be live within 2-3 minutes!

## 🆘 Troubleshooting

### Game Not Loading
- Check that `index.html` is in the root folder
- Verify all file paths are correct
- Check browser console for errors

### Images Not Showing
- Ensure `images/` folder is uploaded
- Check image file names match the code
- Verify file extensions are correct

### GitHub Pages Not Updating
- Wait 2-3 minutes after pushing changes
- Check repository Settings → Pages for deployment status
- Try clearing browser cache

## 📱 Mobile Optimization

The game is already optimized for mobile devices:
- Responsive design
- Touch-friendly controls
- Draggable cards work on touch screens
- Sound controls for mobile users

## 🎓 Sharing Your Game

Once deployed, you can share your game with:
- **Students** - Direct link to play
- **Colleagues** - For educational use
- **Parents** - For home learning
- **Social media** - Spread educational gaming

---

**Your educational game is now live on the web! 🌐**
