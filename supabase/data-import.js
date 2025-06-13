
/**
 * SUPABASE DATA IMPORT SCRIPT
 * This script imports data from the exported JSON file
 * into your new Supabase application
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// New database credentials (replace with your new database info)
const NEW_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_NEW_SUPABASE_URL';
const NEW_SUPABASE_KEY = process.env.NEW_SUPABASE_SERVICE_KEY || 'YOUR_NEW_SERVICE_KEY';

// Create Supabase client for new database
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);

async function importData() {
  try {
    console.log('Starting data import...');
    
    // Read exported data
    const exportPath = path.join(__dirname, 'exported-data.json');
    if (!fs.existsSync(exportPath)) {
      throw new Error('Exported data file not found. Please run the export script first.');
    }
    
    const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    
    // Import job categories first (referenced by mappings)
    if (exportData.job_categories.length > 0) {
      console.log('Importing job categories...');
      const { error: categoriesError } = await newSupabase
        .from('job_categories')
        .upsert(exportData.job_categories, { onConflict: 'name' });
      
      if (categoriesError) {
        console.error('Error importing job categories:', categoriesError);
      } else {
        console.log(`Imported ${exportData.job_categories.length} job categories`);
      }
    }

    // Import profiles
    if (exportData.profiles.length > 0) {
      console.log('Importing profiles...');
      const { error: profilesError } = await newSupabase
        .from('profiles')
        .upsert(exportData.profiles, { onConflict: 'id' });
      
      if (profilesError) {
        console.error('Error importing profiles:', profilesError);
      } else {
        console.log(`Imported ${exportData.profiles.length} profiles`);
      }
    }

    // Import jobs
    if (exportData.jobs.length > 0) {
      console.log('Importing jobs...');
      const { error: jobsError } = await newSupabase
        .from('jobs')
        .upsert(exportData.jobs, { onConflict: 'id' });
      
      if (jobsError) {
        console.error('Error importing jobs:', jobsError);
      } else {
        console.log(`Imported ${exportData.jobs.length} jobs`);
      }
    }

    // Import applications
    if (exportData.applications.length > 0) {
      console.log('Importing applications...');
      const { error: applicationsError } = await newSupabase
        .from('applications')
        .upsert(exportData.applications, { onConflict: 'id' });
      
      if (applicationsError) {
        console.error('Error importing applications:', applicationsError);
      } else {
        console.log(`Imported ${exportData.applications.length} applications`);
      }
    }

    // Import job category mappings
    if (exportData.job_category_mappings.length > 0) {
      console.log('Importing job category mappings...');
      const { error: mappingsError } = await newSupabase
        .from('job_category_mappings')
        .upsert(exportData.job_category_mappings);
      
      if (mappingsError) {
        console.error('Error importing job category mappings:', mappingsError);
      } else {
        console.log(`Imported ${exportData.job_category_mappings.length} job category mappings`);
      }
    }

    console.log('\nData import completed successfully!');
    console.log('\nImport Summary:');
    console.log(`- Profiles: ${exportData.profiles.length}`);
    console.log(`- Jobs: ${exportData.jobs.length}`);
    console.log(`- Applications: ${exportData.applications.length}`);
    console.log(`- Job Categories: ${exportData.job_categories.length}`);
    console.log(`- Category Mappings: ${exportData.job_category_mappings.length}`);

  } catch (error) {
    console.error('Error during import:', error);
  }
}

// Run the import
importData();
