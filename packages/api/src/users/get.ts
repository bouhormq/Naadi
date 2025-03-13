import { User } from '@naadi/types';
import { getDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';
import { db } from '../../utils/firebase';
import { collection, query, where, limit, getDocs, WhereFilterOp } from 'firebase/firestore';

// Define the UserQuery interface if it's not exported from @naadi/types
interface UserQuery {
  displayName?: string;
  email?: string;
  isBusiness?: boolean;
  limit?: number;
}

/**
 * Get a user by ID
 * @param userId ID of the user to retrieve
 * @returns User object
 */
export async function getUserById(userId: string): Promise<User> {
  try {
    // Validate input
    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }
    
    // Get the user document
    const user = await getDocument<User>('users', userId);
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to get user', 500);
  }
}

/**
 * Query users based on filters
 * Note: This would typically be an admin-only function
 * @param queryParams Filter parameters
 * @returns Array of matching users
 */
export async function queryUsers(queryParams: UserQuery): Promise<User[]> {
  try {
    // Create a reference to the users collection
    const usersRef = collection(db, 'users');
    
    // Start building the query
    let q = query(usersRef);
    
    // Add filters based on query parameters
    if (queryParams.displayName) {
      q = query(
        q, 
        where('displayName', '>=', queryParams.displayName),
        where('displayName', '<=', queryParams.displayName + '\uf8ff')
      );
    }
    
    if (queryParams.email) {
      q = query(q, where('email', '==', queryParams.email));
    }
    
    if (queryParams.isBusiness !== undefined) {
      q = query(q, where('isBusiness', '==', queryParams.isBusiness));
    }
    
    // Add limit
    q = query(q, limit(queryParams.limit || 20));
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Convert the query results to an array of users
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as User);
    });
    
    return users;
  } catch (error) {
    console.error('Query users error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to query users', 500);
  }
} 