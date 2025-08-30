# Content Creation Guide

## 📝 Adding Your First Content

### 1. Create Admin User
- Visit http://localhost:3000/admin
- Fill in email, password, first name, last name
- Set role to "admin"
- Click "Create"

### 2. Add Categories First
- Go to "Categories" in the sidebar
- Click "Create New"
- Add category name (slug auto-generates)
- Optionally add description and color
- Click "Save"

### 3. Create Posts
- Go to "Posts" in the sidebar
- Click "Create New"
- Fill required fields:
    - **Title**: Your post title
    - **Content**: Rich text content
    - **Excerpt**: Short description
- Set **Status** to "Published" ⚠️ (Critical!)
- Select categories
- Click "Save"

### 4. Configure Site Settings
- Go to "Globals" → "Settings"
- Add site name and description
- Save changes

## 🐛 Troubleshooting Empty Lists

### Check These Common Issues:
- ❌ Posts in "Draft" status → ✅ Change to "Published"
- ❌ CORS errors → ✅ Check browser console
- ❌ Wrong API URLs → ✅ Verify BlogService endpoints

### Quick Test
Visit http://localhost:3000/api/posts in your browser
- Should see JSON data if posts exist and are published
- Empty `docs: []` means no published posts

### Verify Post Status
1. Go to Posts in admin
2. Check "Status" column
3. Edit any "Draft" posts
4. Change to "Published"
5. Save

## ✅ Success Checklist
- [ ] Admin user created
- [ ] At least one category exists
- [ ] Posts created with "Published" status
- [ ] Site settings configured
- [ ] API endpoint returns data