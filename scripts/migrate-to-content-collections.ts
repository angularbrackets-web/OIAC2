import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Helper to convert HTML to plain text description
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to create slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function migrateJobs() {
  console.log('📋 Migrating Jobs...');
  const data = JSON.parse(
    await readFile('hygraph-export/jobs.json', 'utf-8')
  );

  for (const job of data) {
    const slug = slugify(job.title);
    const content = {
      title: job.title,
      postedDate: job.postedDate,
      description: job.description?.html || '',
      requireAlbertaCertification: job.requireAlbertaCertification,
      active: true,
    };

    await writeFile(
      join('src/content/jobs', `${slug}.json`),
      JSON.stringify(content, null, 2)
    );
  }
  console.log(`✅ Migrated ${data.length} jobs\n`);
}

async function migratePosts() {
  console.log('📰 Migrating Posts...');
  const data = JSON.parse(
    await readFile('hygraph-export/posts.json', 'utf-8')
  );

  for (let i = 0; i < data.length; i++) {
    const post = data[i];
    const slug = slugify(post.title);
    const content = {
      title: post.title,
      image: post.image.map((img: any) => ({ url: img.url })),
      link: {
        text: post.link.text,
        url: post.link.url,
      },
      content: post.content || [],
      priority: i + 1, // Use array index as priority
    };

    await writeFile(
      join('src/content/posts', `${slug}.json`),
      JSON.stringify(content, null, 2)
    );
  }
  console.log(`✅ Migrated ${data.length} posts\n`);
}

async function migrateStaff() {
  console.log('👥 Migrating Staff...');
  const data = JSON.parse(
    await readFile('hygraph-export/staff.json', 'utf-8')
  );

  for (const member of data) {
    const slug = slugify(member.name);
    const content = {
      name: member.name,
      title: member.title,
      displayOrder: member.displayOrder,
      profilePicture: member.profilePicture ? { url: member.profilePicture.url } : null,
      staffType: member.staffType.name,
      description: member.description?.html || null,
    };

    await writeFile(
      join('src/content/staff', `${slug}.json`),
      JSON.stringify(content, null, 2)
    );
  }
  console.log(`✅ Migrated ${data.length} staff members\n`);
}

async function migratePrayerTimes() {
  console.log('🕌 Migrating Prayer Times...');
  const data = JSON.parse(
    await readFile('hygraph-export/prayer-times.json', 'utf-8')
  );

  for (const prayerTime of data) {
    const slug = `${prayerTime.month}-${String(prayerTime.day).padStart(2, '0')}`;
    const content = {
      month: prayerTime.month,
      day: prayerTime.day,
      fajrBegins: prayerTime.fajrBegins,
      fajrJamah: prayerTime.fajrJamah,
      sunrise: prayerTime.sunrise,
      zuhrBegins: prayerTime.zuhrBegins,
      zuhrJamah: prayerTime.zuhrJamah,
      asrBegins: prayerTime.asrBegins,
      asrJamah: prayerTime.asrJamah,
      maghribBegins: prayerTime.maghribBegins,
      maghribJamah: prayerTime.maghribJamah,
      ishaBegins: prayerTime.ishaBegins,
      ishaJamah: prayerTime.ishaJamah,
    };

    await writeFile(
      join('src/content/prayer-times', `${slug}.json`),
      JSON.stringify(content, null, 2)
    );
  }
  console.log(`✅ Migrated ${data.length} prayer time entries\n`);
}

async function migrateJummahTimes() {
  console.log('🕋 Migrating Jummah Times...');
  const data = JSON.parse(
    await readFile('hygraph-export/jummah-times.json', 'utf-8')
  );

  for (let i = 0; i < data.length; i++) {
    const jummah = data[i];
    const slug = slugify(jummah.name);
    const content = {
      name: jummah.name,
      time: jummah.time,
      order: i + 1,
    };

    await writeFile(
      join('src/content/jummah-times', `${slug}.json`),
      JSON.stringify(content, null, 2)
    );
  }
  console.log(`✅ Migrated ${data.length} Jummah times\n`);
}

async function migrateAll() {
  console.log('🚀 Starting migration to Content Collections...\n');

  try {
    await migrateJobs();
    await migratePosts();
    await migrateStaff();
    await migratePrayerTimes();
    await migrateJummahTimes();

    console.log('🎉 Migration completed successfully!');
    console.log('📁 Content Collections created in: src/content/');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrateAll();
