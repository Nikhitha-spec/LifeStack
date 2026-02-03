import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Patient, Session, User } from '../types';

interface AppContextType {
    patients: Patient[];
    sessions: Session[];
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    addPatient: (patient: Patient) => void;
    updatePatient: (patient: Patient) => void;
    addSession: (session: Session) => void;
    updateSession: (sessionId: string, status: 'Waiting' | 'Completed') => void;
    dispensePrescription: (patientId: string, prescriptionId: string) => void;
    setLanguage: (lang: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        // Mock Data Initialization
        const initialPatients: Patient[] = [
            {
                id: "P-1001",
                name: "Alice Johnson",
                bloodGroup: "O+",
                allergies: ["Penicillin", "Peanuts"],
                chronicConditions: ["Type 2 Diabetes"],
                isPharmacyAccessAllowed: true,
                prescriptions: [
                    {
                        id: "RX-201",
                        title: "Insulin Regular",
                        content: "Inject 10 units before meals.",
                        isScribble: false,
                        isDispensed: true,
                        uploadedBy: "Dr. Sarah Lee",
                        doctorLicense: "L-99231",
                        timestamp: "2024-01-20T10:00:00Z"
                    }
                ],
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
                dob: "1992-05-14",
                gender: "Female",
                weight: "65 kg",
                height: "168 cm",
                insuranceId: "INS-77221-X",
                primaryPhysician: "Dr. Sarah Lee"
            },
            {
                id: "P-1002",
                name: "Sarah Miller",
                bloodGroup: "A-",
                allergies: ["Latex"],
                chronicConditions: ["Hypertension"],
                isPharmacyAccessAllowed: false,
                prescriptions: [
                    {
                        id: "RX-202",
                        title: "Anti-inflammatory Course",
                        content: "Handwritten note placeholder",
                        isScribble: true,
                        isDispensed: false,
                        uploadedBy: "Dr. Robert Smith",
                        doctorLicense: "L-44512",
                        timestamp: "2024-02-01T15:30:00Z"
                    }
                ],
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                dob: "1985-11-20",
                gender: "Female",
                weight: "72 kg",
                height: "170 cm",
                insuranceId: "INS-88123-Y",
                primaryPhysician: "Dr. Robert Smith"
            },
            {
                id: "P-1003",
                name: "David Chen",
                bloodGroup: "B+",
                allergies: [],
                chronicConditions: ["Asthma"],
                isPharmacyAccessAllowed: true,
                prescriptions: [],
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
                dob: "1995-03-25",
                gender: "Male",
                weight: "80 kg",
                height: "182 cm",
                insuranceId: "INS-11223-Z",
                primaryPhysician: "Dr. Sarah Lee"
            },
            {
                id: "P-1004",
                name: "Elena Rodriguez",
                bloodGroup: "AB+",
                allergies: ["Sulfa drugs"],
                chronicConditions: [],
                isPharmacyAccessAllowed: false,
                prescriptions: [],
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
                dob: "1990-08-30",
                gender: "Female",
                weight: "58 kg",
                height: "162 cm",
                insuranceId: "INS-99001-A",
                primaryPhysician: "Dr. Robert Smith"
            }
        ];

        const initialSessions: Session[] = [
            {
                id: "S-101",
                patientId: "P-1003",
                doctorName: "Dr. Sarah Lee",
                status: "Waiting",
                timestamp: new Date().toISOString()
            },
            {
                id: "S-102",
                patientId: "P-1002",
                doctorName: "Dr. Robert Smith",
                status: "Waiting",
                timestamp: new Date().toISOString()
            },
            {
                id: "S-103",
                patientId: "P-1004",
                doctorName: "Dr. Sarah Lee",
                status: "Waiting",
                timestamp: new Date().toISOString()
            }
        ];

        setPatients(initialPatients);
        setSessions(initialSessions);
    }, []);

    const addPatient = (patient: Patient) => {
        setPatients(prev => [...prev, patient]);
    };

    const updatePatient = (updatedPatient: Patient) => {
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    };

    const addSession = (session: Session) => {
        setSessions(prev => [...prev, session]);
    };

    const updateSession = (sessionId: string, status: 'Waiting' | 'Completed') => {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status } : s));
    };

    const dispensePrescription = (patientId: string, prescriptionId: string) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    prescriptions: p.prescriptions.map(pr =>
                        pr.id === prescriptionId ? { ...pr, isDispensed: true } : pr
                    )
                };
            }
            return p;
        }));
    };

    const setLanguage = (lang: string) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, preferredLanguage: lang });
        }
    };

    useEffect(() => {
        const lang = currentUser?.preferredLanguage?.toLowerCase() || 'english';
        document.body.className = `lang-${lang}`;
        // Also set the lang attribute
        document.documentElement.lang = lang === 'telugu' ? 'te' : lang === 'hindi' ? 'hi' : 'en';
    }, [currentUser?.preferredLanguage]);

    return (
        <AppContext.Provider value={{
            patients,
            sessions,
            currentUser,
            setCurrentUser,
            addPatient,
            updatePatient,
            addSession,
            updateSession,
            dispensePrescription,
            setLanguage
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
