import { Donor, BloodRequest, RequestStatus } from '../types';

const DONORS_KEY = 'blood_donors_pakistan_donors';
const REQUESTS_KEY = 'blood_donors_pakistan_requests';

export const storage = {
  getDonors: (): Donor[] => {
    try {
      const data = localStorage.getItem(DONORS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDonor: (donor: Donor): void => {
    const donors = storage.getDonors();
    donors.push(donor);
    localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
  },

  getDonorByCode: (accessCode: string): Donor | null => {
    const donors = storage.getDonors();
    return donors.find(d => d.accessCode === accessCode) || null;
  },

  updateDonor: (accessCode: string, updatedDonor: Donor): boolean => {
    const donors = storage.getDonors();
    const index = donors.findIndex(d => d.accessCode === accessCode);

    if (index === -1) return false;

    donors[index] = updatedDonor;
    localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
    return true;
  },

  deleteDonor: (accessCode: string): boolean => {
    const donors = storage.getDonors();
    const filtered = donors.filter(d => d.accessCode !== accessCode);

    if (filtered.length === donors.length) return false;

    localStorage.setItem(DONORS_KEY, JSON.stringify(filtered));
    return true;
  },

  getRequests: (): BloodRequest[] => {
    try {
      const data = localStorage.getItem(REQUESTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getActiveRequests: (): BloodRequest[] => {
    return storage.getRequests().filter(r => r.status === 'active');
  },

  saveRequest: (request: BloodRequest): void => {
    const requests = storage.getRequests();
    requests.push(request);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  },

  getRequestByCode: (accessCode: string): BloodRequest | null => {
    const requests = storage.getRequests();
    return requests.find(r => r.accessCode === accessCode) || null;
  },

  getRequestsByCode: (accessCode: string): BloodRequest[] => {
    const requests = storage.getRequests();
    return requests.filter(r => r.accessCode === accessCode);
  },

  updateRequestStatus: (requestId: string, status: RequestStatus): boolean => {
    const requests = storage.getRequests();
    const index = requests.findIndex(r => r.id === requestId);

    if (index === -1) return false;

    requests[index].status = status;
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    return true;
  },

  deleteRequest: (accessCode: string): boolean => {
    const requests = storage.getRequests();
    const filtered = requests.filter(r => r.accessCode !== accessCode);

    if (filtered.length === requests.length) return false;

    localStorage.setItem(REQUESTS_KEY, JSON.stringify(filtered));
    return true;
  },

  deleteRequestById: (requestId: string): boolean => {
    const requests = storage.getRequests();
    const filtered = requests.filter(r => r.id !== requestId);

    if (filtered.length === requests.length) return false;

    localStorage.setItem(REQUESTS_KEY, JSON.stringify(filtered));
    return true;
  },
};
