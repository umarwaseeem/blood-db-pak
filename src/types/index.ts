// Re-export types from the new database types file
// This maintains backward compatibility with existing imports
export type {
  BloodGroup,
  UrgencyLevel,
  RequestStatus,
  Donor,
  BloodRequest,
} from '../lib/database.types';

