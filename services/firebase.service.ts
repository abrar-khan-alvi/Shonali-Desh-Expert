import { ref, get, query, orderByChild, equalTo, update } from 'firebase/database';
import { database } from '../firebase.config';
import type { ExpertData } from '../types';

/**
 * Login expert by email and password
 * Note: This is a simple DB-based auth for prototype/demo purposes.
 * In production, use Firebase Authentication.
 */
export const loginExpert = async (email: string, password: string): Promise<ExpertData | null> => {
    try {
        // Fetch all experts and filter client-side to avoid needing index rules
        // Note: For large datasets, you should add ".indexOn": "email" to Firebase Rules and use query()
        const expertsRef = ref(database, 'Experts');
        const snapshot = await get(expertsRef);

        if (snapshot.exists()) {
            const experts = snapshot.val();
            // Find expert with matching email
            const expertEntry = Object.entries(experts).find(([_, data]: [string, any]) =>
                data.email === email
            );

            if (expertEntry) {
                const [id, data]: [string, any] = expertEntry;

                // Check password (simple string comparison for prototype)
                // In production, never store plain text passwords!
                if (data.password === password) {
                    return {
                        id,
                        ...data
                    } as ExpertData;
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Error logging in expert:', error);
        throw error;
    }
};

export const updateExpertStatus = async (expertId: string, isAvailable: boolean): Promise<void> => {
    try {
        const expertRef = ref(database, `Experts/${expertId}`);
        await update(expertRef, { hasAvailable: isAvailable });
    } catch (error) {
        console.error('Error updating expert status:', error);
        throw error;
    }
};

export const updateExpertPassword = async (expertId: string, newPassword: string): Promise<void> => {
    try {
        const expertRef = ref(database, `Experts/${expertId}`);
        await update(expertRef, { password: newPassword });
    } catch (error) {
        console.error('Error updating expert password:', error);
        throw error;
    }
};

export const submitConsultationReport = async (
    expertId: string,
    requestId: string,
    farmerId: string,
    reportData: { advice: string; timestamp: string }
): Promise<void> => {
    try {
        // 1. Update Expert's Request Status
        const expertRequestRef = ref(database, `Experts/${expertId}/consultRequests/${requestId}`);
        await update(expertRequestRef, {
            status: 'completed',
            advice: reportData.advice,
            completedAt: reportData.timestamp
        });

        // 2. Add to Farmer's ExpertConsultant node
        // We use push() to generate a unique ID for this report in the farmer's list
        const farmerConsultantRef = ref(database, `Farmers/${farmerId}/ExpertConsultant`);
        // We can use the same requestId or let push generate one. 
        // Using child(requestId) links it directly if the farmer side expects that ID.
        // Based on "submit it in the farmer ExpertConsultant node", let's assume a list.
        // Let's use the requestId as the key for easy lookup/consistency.
        const specificReportRef = ref(database, `Farmers/${farmerId}/ExpertConsultant/${requestId}`);

        await update(specificReportRef, {
            expertId,
            advice: reportData.advice,
            timestamp: reportData.timestamp,
            status: 'completed'
        });

    } catch (error) {
        console.error('Error submitting consultation report:', error);
        throw error;
    }
};
