#!/usr/bin/env python3
import pandas as pd
import json
import os
from datetime import datetime, time

def format_time_12hr(time_val):
    """Convert time to 12-hour format with AM/PM"""
    if pd.isna(time_val):
        return ""

    # If it's already a string, try to parse it
    if isinstance(time_val, str):
        try:
            # Parse the time string
            dt = datetime.strptime(time_val, "%H:%M:%S")
            return dt.strftime("%I:%M %p")
        except:
            return time_val

    # If it's a time object
    if isinstance(time_val, time):
        dt = datetime.combine(datetime.today(), time_val)
        return dt.strftime("%I:%M %p")

    # If it's a datetime object
    if isinstance(time_val, datetime):
        return time_val.strftime("%I:%M %p")

    return str(time_val)

# Read the Excel file
excel_file = '/Users/ibrahim/OIAC2/2026 v2 Prayer Times  Calendar-2.xlsx'
df = pd.read_excel(excel_file)

# Extract month and day from Date column
df['month'] = pd.to_datetime(df['Date']).dt.month
df['day'] = pd.to_datetime(df['Date']).dt.day

# Filter for all months 1-11 (January through November)
# December (12) already exists in the system
data_to_process = df[df['month'] <= 11]

# Create output directory if it doesn't exist
output_dir = '/Users/ibrahim/OIAC2/src/content/prayer-times'
os.makedirs(output_dir, exist_ok=True)

print(f"Processing {len(data_to_process)} days for months 1-11 of 2026...\n")

# Process each day
for idx, row in data_to_process.iterrows():
    month = int(row['month'])
    day = int(row['day'])

    # Create the prayer times object
    prayer_data = {
        "month": month,
        "day": day,
        "fajrBegins": format_time_12hr(row['Fajr Prayer Time']),
        "fajrJamah": format_time_12hr(row['Fajr Iqama']),
        "sunrise": format_time_12hr(row['Sunrise Time']),
        "zuhrBegins": format_time_12hr(row['Dhuhr Prayer Time']),
        "zuhrJamah": format_time_12hr(row['Dhuhr Iqama']),
        "asrBegins": format_time_12hr(row['Asr Prayer Time']),
        "asrJamah": format_time_12hr(row['Asr Iqama']),
        "maghribBegins": format_time_12hr(row['Maghrib Prayer Time']),
        "maghribJamah": format_time_12hr(row['Maghrib Iqama']),
        "ishaBegins": format_time_12hr(row['Isha Prayer Time']),
        "ishaJamah": format_time_12hr(row['Isha Iqama'])
    }

    # Create filename in MM-DD.json format
    filename = f"{month:02d}-{day:02d}.json"
    filepath = os.path.join(output_dir, filename)

    # Write to JSON file
    with open(filepath, 'w') as f:
        json.dump(prayer_data, f, indent=2)

    print(f"Created: {filename}")

print(f"\n✓ Successfully created {len(data_to_process)} prayer time files for 2026 (January-November)")
