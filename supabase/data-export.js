
/**
 * SUPABASE DATA EXPORT SCRIPT
 * This script exports all data from your current Supabase database
 * to be imported into your new Supabase application
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Old database credentials (replace with your current database info)
const OLD_SUPABASE_URL = process.env.OLD_SUPABASE_URL || 'YOUR_OLD_SUPABASE_URL';
const OLD_SUPABASE_KEY = process.env.OLD_SUPABASE_SERVICE_KEY || 'YOUR_OLD_SERVICE_KEY';

// Create Supabase client for old database
const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);

async function exportData() {
  try {
    console.log('Starting data export...');
    
    const exportData = {
      profiles: [],
      jobs: [],
      applications: [],
      job_categories: [],
      job_category_mappings: [],
      exported_at: new Date().toISOString()
    };

    // Export profiles
    console.log('Exporting profiles...');
    const { data: profiles, error: profilesError } = await oldSupabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('Error exporting profiles:', profilesError);
    } else {
      exportData.profiles = profiles;
      console.log(`Exported ${profiles.length} profiles`);
    }

    // Export jobs
    console.log('Exporting jobs...');
    const { data: jobs, error: jobsError } = await oldSupabase
      .from('jobs')
      .select('*');
    
    if (jobsError) {
      console.error('Error exporting jobs:', jobsError);
    } else {
      exportData.jobs = jobs;
      console.log(`Exported ${jobs.length} jobs`);
    }

    // Export applications
    console.log('Exporting applications...');
    const { data: applications, error: applicationsError } = await oldSupabase
      .from('applications')
      .select('*');
    
    if (applicationsError) {
      console.error('Error exporting applications:', applicationsError);
    } else {
      exportData.applications = applications;
      console.log(`Exported ${applications.length} applications`);
    }

    // Export job categories
    console.log('Exporting job categories...');
    const { data: jobCategories, error: categoriesError } = await oldSupabase
      .from('job_categories')
      .select('*');
    
    if (categoriesError) {
      console.error('Error exporting job categories:', categoriesError);
    } else {
      exportData.job_categories = jobCategories;
      console.log(`Exported ${jobCategories.length} job categories`);
    }

    // Export job category mappings
    console.log('Exporting job category mappings...');
    const { data: mappings, error: mappingsError } = await oldSupabase
      .from('job_category_mappings')
      .select('*');
    
    if (mappingsError) {
      console.error('Error exporting job category mappings:', mappingsError);
    } else {
      exportData.job_category_mappings = mappings;
      console.log(`Exported ${mappings.length} job category mappings`);
    }

    // Save to file
    const exportPath = path.join(__dirname, 'exported-data.json');
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
    
    console.log('Data export completed successfully!');
    console.log(`Data saved to: ${exportPath}`);
    console.log('\nExport Summary:');
    console.log(`- Profiles: ${exportData.profiles.length}`);
    console.log(`- Jobs: ${exportData.jobs.length}`);
    console.log(`- Applications: ${exportData.applications.length}`);
    console.log(`- Job Categories: ${exportData.job_categories.length}`);
    console.log(`- Category Mappings: ${exportData.job_category_mappings.length}`);

  } catch (error) {
    console.error('Error during export:', error);
  }
}

// Run the export
exportData();
