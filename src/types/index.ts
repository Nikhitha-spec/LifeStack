export type Role = 'patient' | 'doctor' | 'pharmacist' | 'admin' | 'emergency';

export interface Prescription {
    id: string;
    title: string;
    content: string; // Text or Base64 Image
    isScribble: boolean;
    isDispensed: boolean;
    uploadedBy: string;
    doctorLicense: string;
    timestamp: string;
}

export interface Patient {
    id: string; // P-XXXX
    name: string;
    bloodGroup: string;
    allergies: string[];
    chronicConditions: string[];
    isPharmacyAccessAllowed: boolean;
    prescriptions: Prescription[];
    avatar?: string;
    dob: string;
    gender: string;
    weight: string;
    height: string;
    insuranceId: string;
    primaryPhysician: string;
}

export interface Session {
    id: string;
    patientId: string;
    doctorName: string;
    status: 'Waiting' | 'Completed';
    timestamp: string;
}

export interface User {
    role: Role;
    name: string;
    license?: string;
    preferredLanguage?: string;
}
