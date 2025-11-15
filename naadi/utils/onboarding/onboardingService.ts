import { db } from '@naadi/config/firebase/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { OnboardingData } from './OnboardingContext';

const DRAFT_COLLECTION = 'OnboardingDrafts';
const ONBOARDING_DATA_COLLECTION = 'OnboardingData';

/**
 * Save onboarding draft to Firestore
 * This is called after each step to persist data
 */
export const saveDraftToFirestore = async (
  userId: string,
  data: OnboardingData
): Promise<void> => {
  try {
    const draftRef = doc(db, DRAFT_COLLECTION, userId);
    await setDoc(draftRef, {
      userId,
      data,
      lastUpdated: new Date(),
      version: 1,
    }, { merge: true });
    console.log('Draft saved for user:', userId);
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
};

/**
 * Load onboarding draft from Firestore
 * This is called when the user resumes onboarding
 */
export const loadDraftFromFirestore = async (
  userId: string
): Promise<OnboardingData | null> => {
  try {
    const draftRef = doc(db, DRAFT_COLLECTION, userId);
    const draftSnapshot = await getDoc(draftRef);

    if (draftSnapshot.exists()) {
      console.log('Draft loaded for user:', userId);
      return draftSnapshot.data().data as OnboardingData;
    }
    return null;
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
};

/**
 * Finalize onboarding - save all data to permanent location
 * This is called when onboarding is completed
 */
export const finalizeOnboarding = async (
  userId: string,
  data: OnboardingData
): Promise<void> => {
  try {
    // Save to permanent onboarding data collection
    const onboardingRef = doc(db, ONBOARDING_DATA_COLLECTION, userId);
    await setDoc(onboardingRef, {
      userId,
      data,
      completedAt: new Date(),
      version: 1,
    });

    console.log('Onboarding finalized for user:', userId);

    // Delete the draft after successful completion
    await deleteDraftFromFirestore(userId);
  } catch (error) {
    console.error('Error finalizing onboarding:', error);
    throw error;
  }
};

/**
 * Delete onboarding draft from Firestore
 * This is called after onboarding is completed or when starting over
 */
export const deleteDraftFromFirestore = async (userId: string): Promise<void> => {
  try {
    const draftRef = doc(db, DRAFT_COLLECTION, userId);
    await deleteDoc(draftRef);
    console.log('Draft deleted for user:', userId);
  } catch (error) {
    console.error('Error deleting draft:', error);
    throw error;
  }
};

/**
 * Get current step from draft
 * This helps resume from where they left off
 */
export const getCurrentStepFromDraft = async (userId: string): Promise<number> => {
  try {
    const draft = await loadDraftFromFirestore(userId);
    if (!draft) return 1;

    // Check which fields are filled to determine progress
    const filledFields = Object.keys(draft).filter(
      key => draft[key as keyof OnboardingData] !== undefined && draft[key as keyof OnboardingData] !== null
    );

    // Return step based on how many fields are filled
    // This is a simple calculation - you can customize based on your logic
    return Math.min(filledFields.length + 1, 14);
  } catch (error) {
    console.error('Error getting current step:', error);
    return 1;
  }
};
