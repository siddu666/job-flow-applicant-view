export interface Profile {
    first_name: string | null
    last_name: string | null
    phone: string | null
    current_location: string | null
    bio: string | null
    skills: string[] | null
    experience_years: number | null
    linkedin_url: string| null
    github_url: string| null
    portfolio_url: string| null
    email: string| null
    role: string| null
    certifications: string[]| null
    preferred_cities: string[]| null
    willing_to_relocate: boolean| null
    job_seeking_status: string| null
    expected_salary_sek: number | null
    cv_url: string | null
    visa_status: string | null
    availability: string | null
    created_at: string | null
    id: string
    updated_at: string | null
}