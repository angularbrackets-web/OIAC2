import type { APIRoute } from 'astro';
import { createVolunteer, getVolunteerByEmail } from '../../../lib/db';

export type Volunteer = {
  "name": string,
  "email": string,
  "phone": string,
  "expertise": string,
  "message": string
}

export type AddVolunteerApiResponse = {
  "status": string,
  "error_message": string
}

export const POST: APIRoute = async ({ request }) => {
  const volunteer: Volunteer = await request.json();

  try {
    // Check if email already exists
    const existingVolunteer = await getVolunteerByEmail(volunteer.email);

    if (existingVolunteer.length > 0) {
      let error_response: AddVolunteerApiResponse = {
        status: "error",
        error_message: `Email "${volunteer.email}" is already registered for volunteering!`
      };

      return new Response(JSON.stringify(error_response), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Create new volunteer record
    await createVolunteer({
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      expertise: volunteer.expertise,
      message: volunteer.message,
    });

    let success_response: AddVolunteerApiResponse = {
      status: "success",
      error_message: ""
    };

    return new Response(JSON.stringify(success_response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (err) {
    console.error('Error creating volunteer:', err);
    let error_response: AddVolunteerApiResponse = {
      status: "error",
      error_message: "Failed to register volunteer. Please try again."
    };

    return new Response(JSON.stringify(error_response), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
