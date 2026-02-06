export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'Normal' | 'Urgent' | 'Critical';

export type RequestStatus = 'active' | 'fulfilled' | 'notNeeded' | 'deceased';

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
