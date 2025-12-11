import { getJobs } from '../src/graphql/jobs';
import { getPosts } from '../src/graphql/posts';
import { getEventsForMonths } from '../src/graphql/events';
import { getStaffMembers } from '../src/graphql/staff';
import { getPrayerTimesForCurrentMonth, getJummahTimes } from '../src/graphql/prayer-times';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function exportAllContent() {
  console.log('🚀 Starting Hygraph content export...\n');

  // Create export directory
  const exportDir = join(process.cwd(), 'hygraph-export');
  await mkdir(exportDir, { recursive: true });

  try {
    // Export Jobs
    console.log('📋 Exporting Jobs...');
    const jobs = await getJobs();
    await writeFile(
      join(exportDir, 'jobs.json'),
      JSON.stringify(jobs, null, 2)
    );
    console.log(`✅ Exported ${jobs?.length || 0} jobs\n`);

    // Export Posts
    console.log('📰 Exporting Posts...');
    const posts = await getPosts();
    await writeFile(
      join(exportDir, 'posts.json'),
      JSON.stringify(posts, null, 2)
    );
    console.log(`✅ Exported ${posts?.length || 0} posts\n`);

    // Export Events (all 12 months)
    console.log('📅 Exporting Events...');
    const events = await getEventsForMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    await writeFile(
      join(exportDir, 'events.json'),
      JSON.stringify(events, null, 2)
    );
    console.log(`✅ Exported ${events?.length || 0} events\n`);

    // Export Staff
    console.log('👥 Exporting Staff...');
    const staff = await getStaffMembers();
    await writeFile(
      join(exportDir, 'staff.json'),
      JSON.stringify(staff, null, 2)
    );
    console.log(`✅ Exported ${staff?.length || 0} staff members\n`);

    // Export Prayer Times (current month - we'll need to run this for all months)
    console.log('🕌 Exporting Prayer Times...');
    const prayerTimes = await getPrayerTimesForCurrentMonth();
    await writeFile(
      join(exportDir, 'prayer-times.json'),
      JSON.stringify(prayerTimes, null, 2)
    );
    console.log(`✅ Exported ${prayerTimes?.length || 0} prayer time entries\n`);

    // Export Jummah Times
    console.log('🕋 Exporting Jummah Times...');
    const jummahTimes = await getJummahTimes();
    await writeFile(
      join(exportDir, 'jummah-times.json'),
      JSON.stringify(jummahTimes, null, 2)
    );
    console.log(`✅ Exported ${jummahTimes?.length || 0} Jummah times\n`);

    console.log('🎉 Export completed successfully!');
    console.log(`📁 All data saved to: ${exportDir}`);

    // Summary
    console.log('\n📊 Export Summary:');
    console.log(`   Jobs: ${jobs?.length || 0}`);
    console.log(`   Posts: ${posts?.length || 0}`);
    console.log(`   Events: ${events?.length || 0}`);
    console.log(`   Staff: ${staff?.length || 0}`);
    console.log(`   Prayer Times: ${prayerTimes?.length || 0}`);
    console.log(`   Jummah Times: ${jummahTimes?.length || 0}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  }
}

// Run export
exportAllContent();
