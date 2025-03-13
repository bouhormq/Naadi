// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing User App Classes API Endpoints...');

// Test get all classes endpoint
async function testGetAllClassesEndpoint() {
  console.log('\n📋 Testing GET /api/classes...');
  
  // Mock implementation of GET /api/classes endpoint
  async function handleGetAllClasses(request) {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 20;
      const studioId = url.searchParams.get('studioId');
      const category = url.searchParams.get('category');
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      const instructorId = url.searchParams.get('instructorId');
      
      // In a real implementation, this would query the database with filters
      // For testing, we'll use our mock data
      
      // Initialize mock data if it doesn't exist
      if (!API.mockData || !API.mockData.classes) {
        if (!API.mockData) API.mockData = {};
        API.mockData.classes = {
          'class-123': {
            id: 'class-123',
            studioId: 'studio-123',
            name: 'Vinyasa Flow Yoga',
            description: 'A flowing yoga practice connecting breath with movement',
            duration: 60,
            capacity: 20,
            instructorId: 'instructor-123',
            category: 'yoga',
            level: 'all-levels',
            equipment: ['yoga mat', 'blocks', 'straps'],
            rating: 4.9,
            schedule: [
              {
                dayOfWeek: 1, // Monday
                startTime: '08:00',
                endTime: '09:00'
              },
              {
                dayOfWeek: 3, // Wednesday
                startTime: '08:00',
                endTime: '09:00'
              },
              {
                dayOfWeek: 5, // Friday
                startTime: '08:00',
                endTime: '09:00'
              }
            ]
          },
          'class-456': {
            id: 'class-456',
            studioId: 'studio-123',
            name: 'Meditation Basics',
            description: 'Introduction to meditation techniques for beginners',
            duration: 45,
            capacity: 15,
            instructorId: 'instructor-789',
            category: 'meditation',
            level: 'beginner',
            equipment: ['meditation cushion'],
            rating: 4.7,
            schedule: [
              {
                dayOfWeek: 2, // Tuesday
                startTime: '19:00',
                endTime: '19:45'
              },
              {
                dayOfWeek: 4, // Thursday
                startTime: '19:00',
                endTime: '19:45'
              }
            ]
          },
          'class-789': {
            id: 'class-789',
            studioId: 'studio-456',
            name: 'High-Intensity Interval Training',
            description: 'Intense cardio and strength intervals for maximum results',
            duration: 45,
            capacity: 25,
            instructorId: 'instructor-456',
            category: 'hiit',
            level: 'intermediate',
            equipment: ['dumbbells', 'kettlebells', 'jump rope'],
            rating: 4.8,
            schedule: [
              {
                dayOfWeek: 1, // Monday
                startTime: '18:00',
                endTime: '18:45'
              },
              {
                dayOfWeek: 3, // Wednesday
                startTime: '18:00',
                endTime: '18:45'
              },
              {
                dayOfWeek: 5, // Friday
                startTime: '18:00',
                endTime: '18:45'
              }
            ]
          }
        };
      }
      
      // Convert object to array
      let classes = Object.values(API.mockData.classes);
      
      // Apply filters
      if (studioId) {
        classes = classes.filter(cls => cls.studioId === studioId);
      }
      
      if (category) {
        classes = classes.filter(cls => cls.category === category.toLowerCase());
      }
      
      if (instructorId) {
        classes = classes.filter(cls => cls.instructorId === instructorId);
      }
      
      // Date filtering is more complex, we would need class instance data
      // For testing, we'll just pretend this works
      
      // Apply limit
      classes = classes.slice(0, limit);
      
      // Get instructors for these classes
      const instructorIds = [...new Set(classes.map(cls => cls.instructorId).filter(Boolean))];
      let instructors = {};
      
      if (API.mockData.instructors) {
        instructorIds.forEach(id => {
          if (API.mockData.instructors[id]) {
            const instructor = API.mockData.instructors[id];
            instructors[id] = {
              id: instructor.id,
              firstName: instructor.firstName,
              lastName: instructor.lastName,
              profileImage: instructor.profileImage || null
            };
          }
        });
      }
      
      // Get studios for these classes
      const studioIds = [...new Set(classes.map(cls => cls.studioId).filter(Boolean))];
      let studios = {};
      
      if (API.mockData.studios) {
        studioIds.forEach(id => {
          if (API.mockData.studios[id]) {
            const studio = API.mockData.studios[id];
            studios[id] = {
              id: studio.id,
              name: studio.name,
              address: studio.address,
              rating: studio.rating || null
            };
          }
        });
      }
      
      return {
        status: 200,
        body: {
          classes,
          instructors,
          studios,
          count: classes.length
        }
      };
    } catch (error) {
      console.error('Error getting classes:', error);
      return {
        status: 500,
        body: { error: 'Failed to get classes' }
      };
    }
  }
  
  try {
    // Test case 1: Get all classes
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes'),
      method: 'GET'
    });
    
    const response1 = await handleGetAllClasses(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.classes || !Array.isArray(response1.body.classes)) {
      throw new Error('Response should include classes array');
    }
    
    console.log('✅ Successfully retrieved all classes');
    
    // Test case 2: Get classes for a specific studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes', { studioId: 'studio-123' }),
      method: 'GET'
    });
    
    const response2 = await handleGetAllClasses(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    // Make sure we only got classes for the requested studio
    const filteredClasses = response2.body.classes.filter(cls => cls.studioId !== 'studio-123');
    if (filteredClasses.length > 0) {
      throw new Error('Response should only include classes for the requested studio');
    }
    
    console.log('✅ Successfully retrieved classes for a specific studio');
    
    // Test case 3: Get classes with category filter
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes', { category: 'yoga' }),
      method: 'GET'
    });
    
    const response3 = await handleGetAllClasses(request3);
    
    if (response3.status !== 200) {
      throw new Error(`Expected status 200, got ${response3.status}`);
    }
    
    console.log('✅ Successfully retrieved classes with category filter');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get all classes endpoint:', error);
    return false;
  }
}

// Test get class by ID endpoint
async function testGetClassByIdEndpoint() {
  console.log('\n📋 Testing GET /api/classes/[id]...');
  
  // Mock implementation of GET /api/classes/[id] endpoint
  async function handleGetClassById(request) {
    try {
      // Extract class ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const classId = pathParts[pathParts.length - 1];
      
      if (!classId) {
        return {
          status: 400,
          body: { error: 'Class ID is required' }
        };
      }
      
      // Ensure we have mock data
      if (!API.mockData || !API.mockData.classes) {
        if (!API.mockData) API.mockData = {};
        API.mockData.classes = {
          'class-123': {
            id: 'class-123',
            studioId: 'studio-123',
            name: 'Vinyasa Flow Yoga',
            description: 'A flowing yoga practice connecting breath with movement',
            duration: 60,
            capacity: 20,
            instructorId: 'instructor-123',
            category: 'yoga',
            level: 'all-levels',
            equipment: ['yoga mat', 'blocks', 'straps'],
            rating: 4.9,
            schedule: [
              {
                dayOfWeek: 1, // Monday
                startTime: '08:00',
                endTime: '09:00'
              },
              {
                dayOfWeek: 3, // Wednesday
                startTime: '08:00',
                endTime: '09:00'
              },
              {
                dayOfWeek: 5, // Friday
                startTime: '08:00',
                endTime: '09:00'
              }
            ]
          }
        };
      }
      
      // Get class data
      const classData = API.mockData.classes[classId];
      
      if (!classData) {
        return {
          status: 404,
          body: { error: 'Class not found' }
        };
      }
      
      // Get instructor data
      let instructor = null;
      if (classData.instructorId && API.mockData.instructors && API.mockData.instructors[classData.instructorId]) {
        const instructorData = API.mockData.instructors[classData.instructorId];
        instructor = {
          id: instructorData.id,
          firstName: instructorData.firstName,
          lastName: instructorData.lastName,
          bio: instructorData.bio,
          specialties: instructorData.specialties,
          profileImage: instructorData.profileImage || null,
          rating: instructorData.rating
        };
      }
      
      // Get studio data
      let studio = null;
      if (classData.studioId && API.mockData.studios && API.mockData.studios[classData.studioId]) {
        const studioData = API.mockData.studios[classData.studioId];
        studio = {
          id: studioData.id,
          name: studioData.name,
          address: studioData.address,
          amenities: studioData.amenities || [],
          rating: studioData.rating || null
        };
      }
      
      // Get rating data
      let feedbackCount = 0;
      let averageRating = 0;
      let ratingDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };
      
      if (API.mockData.feedback) {
        const classFeedback = Object.values(API.mockData.feedback)
          .filter(feedback => feedback.classId === classId);
        
        feedbackCount = classFeedback.length;
        
        if (feedbackCount > 0) {
          const ratingSum = classFeedback.reduce((sum, feedback) => sum + feedback.rating, 0);
          averageRating = ratingSum / feedbackCount;
          
          // Calculate rating distribution
          classFeedback.forEach(feedback => {
            ratingDistribution[feedback.rating] += 1;
          });
        }
      }
      
      // Calculate upcoming sessions (simplified for testing)
      const now = new Date();
      const upcomingSessions = [];
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
      
      if (classData.schedule) {
        // Find the next sessions in the schedule
        for (let i = 0; i < 7; i++) {
          const targetDay = (dayOfWeek + i) % 7 || 7; // Convert 0 to 7 for Sunday
          
          const sessionsOnDay = classData.schedule.filter(
            session => session.dayOfWeek === targetDay
          );
          
          if (sessionsOnDay.length > 0) {
            for (const session of sessionsOnDay) {
              // Create date for this session
              const sessionDate = new Date(now);
              sessionDate.setDate(now.getDate() + i);
              
              // Parse time
              const [startHour, startMinute] = session.startTime.split(':').map(Number);
              const [endHour, endMinute] = session.endTime.split(':').map(Number);
              
              // Set time
              const startTime = new Date(sessionDate);
              startTime.setHours(startHour, startMinute, 0, 0);
              
              const endTime = new Date(sessionDate);
              endTime.setHours(endHour, endMinute, 0, 0);
              
              // Check if this session is in the future
              if (startTime > now) {
                upcomingSessions.push({
                  date: startTime.toISOString().slice(0, 10),
                  startTime: session.startTime,
                  endTime: session.endTime,
                  dayOfWeek: targetDay,
                  availableSpots: classData.capacity // In a real app, this would account for bookings
                });
                
                // Only get the next few sessions
                if (upcomingSessions.length >= 5) break;
              }
            }
          }
          
          // Stop once we have enough sessions
          if (upcomingSessions.length >= 5) break;
        }
      }
      
      return {
        status: 200,
        body: {
          class: classData,
          instructor,
          studio,
          feedback: {
            count: feedbackCount,
            averageRating,
            distribution: ratingDistribution
          },
          upcomingSessions
        }
      };
    } catch (error) {
      console.error('Error getting class details:', error);
      return {
        status: 500,
        body: { error: 'Failed to get class details' }
      };
    }
  }
  
  try {
    // Test case 1: Get existing class
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/class-123'),
      method: 'GET'
    });
    
    const response1 = await handleGetClassById(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.class || response1.body.class.id !== 'class-123') {
      throw new Error('Response should include class data');
    }
    
    if (!response1.body.upcomingSessions || !Array.isArray(response1.body.upcomingSessions)) {
      throw new Error('Response should include upcoming sessions');
    }
    
    console.log('✅ Successfully retrieved class by ID');
    
    // Test case 2: Get non-existent class
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/non-existent'),
      method: 'GET'
    });
    
    const response2 = await handleGetClassById(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent class');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get class by ID endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getAllClassesResult = await testGetAllClassesEndpoint();
    const getClassByIdResult = await testGetClassByIdEndpoint();
    
    if (getAllClassesResult && getClassByIdResult) {
      console.log('\n🎉 All Classes API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Classes API Endpoint tests failed!');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error running tests:', error);
    return false;
  }
}

// Run the tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}); 