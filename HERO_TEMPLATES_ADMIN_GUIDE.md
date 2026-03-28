# Hero Templates - Quick Start Guide for Admins

This is a quick reference for using the new hero templates system.

## Access the Admin Page

**URL**: `https://yoursite.com/admin/hero-templates`

You will see a list of all hero templates with:
- Preview thumbnail
- Template name
- "Active" status (green badge if active)
- Edit, Delete, and Set Active buttons

## Create a New Hero Template

1. Click **"Create Template"** button
2. Fill in the form:
   - **Template Title** - Internal name (e.g., "Spring Campaign")
   - **Badge Text** - Text that appears above the headline (e.g., "SPRING 2026")
   - **Subtitle** - Optional description text
   - **Background Type** - Choose one:
     - **Solid Color** - Pick a color with the color picker or enter hex code
     - **Image** - Enter image URL or browse from media library
   - **CTA Button Text** - Button label (e.g., "Sign Up", "Learn More")
   - **CTA Button Link** - Where button goes (URL)
3. Click **"Save Template"**

Done! Your template is saved.

## Make a Template "Active" (Show on Homepage)

1. In the template list, find the template you want to activate
2. Click the radio button next to "Active"
3. A toast message confirms it's now active
4. Visit the homepage - it now shows your template

**Note**: Only one template can be active at a time.

## Edit a Template

1. Click the **pencil icon** on the template
2. Make your changes in the form
3. Click **"Save Template"**
4. If it was the active template, changes appear on homepage immediately

## Delete a Template

1. Click the **trash icon** on the template
2. Confirm when prompted
3. Template is deleted

**Important**: You cannot delete the active template. If you want to delete it:
1. Set a different template as active
2. Then delete the one you want removed

## Switch Between Templates

Templates are great for campaigns or seasonal changes:

1. Create templates for each campaign (e.g., "Ramadan 2026", "Eid Campaign")
2. When you want to switch, go to `/admin/hero-templates`
3. Click the radio button on the template you want to show
4. Homepage updates instantly - no page refresh needed

## What the Template Controls

When you set a template as active, it changes these on the homepage hero section:

- ✅ Badge text (e.g., "UPCOMING PROJECT")
- ✅ Main headline
- ✅ Subtitle (optional)
- ✅ Background color or image
- ✅ Call-to-action button text
- ✅ Call-to-action button link

## What Stays the Same

These are NOT controlled by templates (they always appear):
- Logo section
- Video embed
- Donation description
- E-transfer donation section

If you need to change those, contact a developer.

## Troubleshooting

### I can't delete a template
**Solution**: The template might be active. Set another template as active first, then try deleting.

### Template not showing on homepage
**Solution**: Make sure you clicked the radio button to set it as active. The green "Active" badge should appear.

### Image not loading
**Solution**: 
1. Make sure the image URL is publicly accessible
2. Try uploading the image through the "Browse" button to use our media library
3. Use a CDN or public image hosting

### Template form showing different fields than expected
**Solution**: Make sure you selected the right "Background Type" at the top - this changes what fields appear below.

## Tips & Best Practices

1. **Create multiple templates** for different seasons or campaigns
2. **Name them clearly** - use template names like "Ramadan 2026", not just "Hero1"
3. **Test before activating** - Edit the template several times before setting as active
4. **Use professional colors** - Stick to brand colors from design team
5. **Keep links updated** - Make sure CTA button links point to the right place
6. **Preview images first** - Add image URL and wait for preview to load before saving

## Contact

For technical issues or questions, contact the development team.
