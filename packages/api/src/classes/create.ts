import { CreateClassRequest, Class, Studio } from '@naadi/types';
import { createDocument, getDocument } from '../../utils/firestore';
import { ApiError } from '../../utils/apiError';

/**
 * Creates a new class
 * @param data CreateClassRequest data from client
 * @param businessId ID of the business creating the class
 * @returns Created class object
 */
export async function createClass(data: CreateClassRequest, businessId: string) {
  try {
    const { 
      studioId, 
      name, 
      description, 
      instructor, 
      startTime, 
      endTime, 
      capacity, 
      price, 
      tags = [] 
    } = data;
    
    // Validate input
    if (!studioId || !name || !description || !instructor || !startTime || !endTime || !capacity || !price) {
      throw new ApiError('All fields except tags are required', 400);
    }
    
    if (!businessId) {
      throw new ApiError('Business ID is required', 400);
    }
    
    // Check if studio exists and belongs to this business
    const studio = await getDocument<Studio>('studios', studioId);
    
    if (!studio) {
      throw new ApiError('Studio not found', 404);
    }
    
    if (studio.businessId !== businessId) {
      throw new ApiError('You do not have permission to create classes for this studio', 403);
    }
    
    // Validate time format and logic
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ApiError('Invalid time format', 400);
    }
    
    if (start >= end) {
      throw new ApiError('End time must be after start time', 400);
    }
    
    // Validate capacity and price
    if (capacity <= 0) {
      throw new ApiError('Capacity must be greater than 0', 400);
    }
    
    if (price < 0) {
      throw new ApiError('Price cannot be negative', 400);
    }
    
    // Create the class
    const classData: Omit<Class, 'id'> = {
      studioId,
      name,
      description,
      instructor,
      startTime,
      endTime,
      capacity,
      price,
      tags,
      createdAt: new Date().toISOString()
    };
    
    const classId = await createDocument<Class>('classes', classData);
    
    return {
      id: classId,
      ...classData
    };
  } catch (error) {
    console.error('Class creation error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to create class', 500);
  }
} 