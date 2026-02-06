export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UrgencyLevel = 'Normal' | 'Urgent' | 'Critical';
export type RequestStatus = 'active' | 'fulfilled' | 'notNeeded' | 'deceased';

export interface Database {
    public: {
        Tables: {
            donors: {
                Row: {
                    id: string;
                    access_code: string;
                    profile_picture: string | null;
                    full_name: string;
                    phone_number: string;
                    blood_group: string;
                    city: string;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    access_code: string;
                    profile_picture?: string | null;
                    full_name: string;
                    phone_number: string;
                    blood_group: string;
                    city: string;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    access_code?: string;
                    profile_picture?: string | null;
                    full_name?: string;
                    phone_number?: string;
                    blood_group?: string;
                    city?: string;
                    notes?: string | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            blood_requests: {
                Row: {
                    id: string;
                    access_code: string;
                    blood_group: string;
                    patient_name: string | null;
                    contact_number: string;
                    location: string;
                    urgency: string;
                    notes: string | null;
                    status: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    access_code: string;
                    blood_group: string;
                    patient_name?: string | null;
                    contact_number: string;
                    location: string;
                    urgency: string;
                    notes?: string | null;
                    status?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    access_code?: string;
                    blood_group?: string;
                    patient_name?: string | null;
                    contact_number?: string;
                    location?: string;
                    urgency?: string;
                    notes?: string | null;
                    status?: string;
                    created_at?: string;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}

// Row types for easy access
export type DonorRow = Database['public']['Tables']['donors']['Row'];
export type DonorInsert = Database['public']['Tables']['donors']['Insert'];
export type DonorUpdate = Database['public']['Tables']['donors']['Update'];

export type BloodRequestRow = Database['public']['Tables']['blood_requests']['Row'];
export type BloodRequestInsert = Database['public']['Tables']['blood_requests']['Insert'];
export type BloodRequestUpdate = Database['public']['Tables']['blood_requests']['Update'];

// Mapped types matching existing app interfaces (camelCase)
export interface Donor {
    id: string;
    accessCode: string;
    profilePicture?: string;
    fullName: string;
    phoneNumber: string;
    bloodGroup: BloodGroup;
    city: string;
    notes?: string;
    createdAt: string;
}

export interface BloodRequest {
    id: string;
    accessCode: string;
    bloodGroup: BloodGroup;
    patientName?: string;
    contactNumber: string;
    location: string;
    urgency: UrgencyLevel;
    notes?: string;
    status: RequestStatus;
    createdAt: string;
}

// Mapping functions between database (snake_case) and app (camelCase)
export function mapDonorFromDB(row: DonorRow): Donor {
    return {
        id: row.id,
        accessCode: row.access_code,
        profilePicture: row.profile_picture ?? undefined,
        fullName: row.full_name,
        phoneNumber: row.phone_number,
        bloodGroup: row.blood_group as BloodGroup,
        city: row.city,
        notes: row.notes ?? undefined,
        createdAt: row.created_at,
    };
}

export function mapDonorToDB(donor: Omit<Donor, 'id' | 'createdAt'>): DonorInsert {
    return {
        access_code: donor.accessCode,
        profile_picture: donor.profilePicture ?? null,
        full_name: donor.fullName,
        phone_number: donor.phoneNumber,
        blood_group: donor.bloodGroup,
        city: donor.city,
        notes: donor.notes ?? null,
    };
}

export function mapDonorUpdateToDB(donor: Partial<Omit<Donor, 'id' | 'createdAt' | 'accessCode'>>): DonorUpdate {
    const update: DonorUpdate = {};
    if (donor.profilePicture !== undefined) update.profile_picture = donor.profilePicture ?? null;
    if (donor.fullName !== undefined) update.full_name = donor.fullName;
    if (donor.phoneNumber !== undefined) update.phone_number = donor.phoneNumber;
    if (donor.bloodGroup !== undefined) update.blood_group = donor.bloodGroup;
    if (donor.city !== undefined) update.city = donor.city;
    if (donor.notes !== undefined) update.notes = donor.notes ?? null;
    return update;
}

export function mapRequestFromDB(row: BloodRequestRow): BloodRequest {
    return {
        id: row.id,
        accessCode: row.access_code,
        bloodGroup: row.blood_group as BloodGroup,
        patientName: row.patient_name ?? undefined,
        contactNumber: row.contact_number,
        location: row.location,
        urgency: row.urgency as UrgencyLevel,
        notes: row.notes ?? undefined,
        status: row.status as RequestStatus,
        createdAt: row.created_at,
    };
}

export function mapRequestToDB(request: Omit<BloodRequest, 'id' | 'createdAt'>): BloodRequestInsert {
    return {
        access_code: request.accessCode,
        blood_group: request.bloodGroup,
        patient_name: request.patientName ?? null,
        contact_number: request.contactNumber,
        location: request.location,
        urgency: request.urgency,
        notes: request.notes ?? null,
        status: request.status,
    };
}
