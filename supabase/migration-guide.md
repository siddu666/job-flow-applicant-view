
# Supabase Database Migration Guide

This guide will help you migrate your complete Supabase database to a new Supabase application.

## Prerequisites

1. Access to your current Supabase project
2. A new Supabase project created
3. Node.js installed
4. Supabase CLI installed (optional but recommended)

## Step 1: Prepare Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Old Database (Source)
OLD_SUPABASE_URL=https://your-old-project.supabase.co
OLD_SUPABASE_SERVICE_KEY=your_old_service_key_here

# New Database (Destination)
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key_here
NEW_SUPABASE_SERVICE_KEY=your_new_service_key_here
```

## Step 2: Install Dependencies

Make sure you have the required dependencies:

```bash
npm install @supabase/supabase-js
```

## Step 3: Create Schema in New Database

Run the migration script in your new Supabase database:

1. Go to your new Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migration-export.sql`
4. Execute the script

This will create:
- All tables with proper structure
- Row Level Security policies
- Storage buckets and policies
- Functions and triggers
- Default data (job categories)

## Step 4: Export Data from Old Database

Run the data export script:

```bash
node supabase/data-export.js
```

This will create an `exported-data.json` file containing all your data.

## Step 5: Import Data to New Database

Run the data import script:

```bash
node supabase/data-import.js
```

This will import all your data into the new database.

## Step 6: Update Your Application Configuration

Update your application to use the new Supabase project:

1. Update environment variables in your production environment
2. Update `supabase/config.toml` with your new project ID
3. Test your application with the new database

## Step 7: Migrate Storage Files (If Any)

If you have files in Supabase Storage:

1. Download files from old storage bucket
2. Upload to new storage bucket
3. Update file URLs in your database if needed

## Step 8: Update Authentication Settings

In your new Supabase project dashboard:

1. Configure authentication providers
2. Set up email templates
3. Configure redirect URLs
4. Set up any custom claims or hooks

## Step 9: Test Migration

1. Test user authentication
2. Test data retrieval
3. Test file uploads/downloads
4. Test all application features

## Step 10: Switch Production

Once everything is tested:

1. Update production environment variables
2. Deploy your application
3. Monitor for any issues

## Troubleshooting

### Common Issues:

1. **Authentication Issues**: Make sure auth settings are configured in new project
2. **Missing Data**: Check for any foreign key constraint errors during import
3. **File Access Issues**: Verify storage policies and bucket configuration
4. **RLS Policy Issues**: Ensure all policies are properly applied

### Rollback Plan:

Keep your old Supabase project active until you're confident the migration is successful. You can always switch back by reverting environment variables.

## Verification Checklist

- [ ] All tables created successfully
- [ ] All data imported correctly
- [ ] Authentication works
- [ ] File storage works
- [ ] All application features work
- [ ] Production environment updated
- [ ] Users can access their data
- [ ] No data loss confirmed

## Notes

- This migration preserves all UUIDs and relationships
- User authentication data is handled automatically by Supabase
- Make sure to test thoroughly before switching production
- Consider running migration during low-traffic hours
