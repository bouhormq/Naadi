// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing Business App Analytics API Endpoints...');

// Test get overview analytics endpoint
async function testGetOverviewAnalyticsEndpoint() {
  console.log('\n📋 Testing GET /api/analytics/overview...');
  
  // Mock implementation of GET /api/analytics/overview endpoint
  async function handleGetOverviewAnalytics(request) {
    try {
      // Check for authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          status: 401,
          body: { error: 'Authentication required' }
        };
      }
      
      const token = authHeader.split(' ')[1];
      const userId = API.getUserIdFromToken(token);
      
      if (!userId) {
        return {
          status: 401,
          body: { error: 'Invalid token' }
        };
      }
      
      // Get query parameters
      const url = new URL(request.url);
      const period = url.searchParams.get('period') || 'week'; // Default to week
      
      // Get user data
      try {
        const user = await API.getUserById(userId);
        
        // Check if user is a business user
        if (user.role !== 'business') {
          return {
            status: 403,
            body: { error: 'Access denied. Business account required.' }
          };
        }
        
        // Check if business has analytics feature (premium plan)
        try {
          const business = await API.getBusinessByOwnerId(userId);
          
          if (business.plan !== 'premium') {
            return {
              status: 403,
              body: { error: 'Analytics features require a Premium plan. Please upgrade your subscription.' }
            };
          }
          
          // Get business analytics
          const analytics = await API.getBusinessAnalytics(business.id);
          
          // Prepare the response based on the requested period
          let overviewData;
          
          switch (period) {
            case 'day':
              overviewData = {
                totalBookings: 12,
                revenue: 345.00,
                averageAttendance: 79.5,
                topClasses: [
                  { name: 'Morning Yoga', bookings: 8 },
                  { name: 'Pilates Fusion', bookings: 6 },
                  { name: 'HIIT', bookings: 5 }
                ],
                comparison: {
                  bookings: 8.2, // percent change from previous period
                  revenue: 12.5,
                  attendance: -2.1
                }
              };
              break;
            case 'week':
              overviewData = {
                totalBookings: 87,
                revenue: 2345.00,
                averageAttendance: 81.2,
                topClasses: [
                  { name: 'Morning Yoga', bookings: 22 },
                  { name: 'Pilates Fusion', bookings: 18 },
                  { name: 'HIIT', bookings: 15 }
                ],
                comparison: {
                  bookings: 5.8,
                  revenue: 7.6,
                  attendance: 1.3
                }
              };
              break;
            case 'month':
              overviewData = {
                totalBookings: 342,
                revenue: 9876.00,
                averageAttendance: 83.7,
                topClasses: [
                  { name: 'Morning Yoga', bookings: 89 },
                  { name: 'Pilates Fusion', bookings: 76 },
                  { name: 'HIIT', bookings: 65 }
                ],
                comparison: {
                  bookings: 12.4,
                  revenue: 15.2,
                  attendance: 4.8
                }
              };
              break;
            case 'year':
              overviewData = {
                totalBookings: 4235,
                revenue: 120987.00,
                averageAttendance: 84.1,
                topClasses: [
                  { name: 'Morning Yoga', bookings: 1089 },
                  { name: 'Pilates Fusion', bookings: 967 },
                  { name: 'HIIT', bookings: 821 }
                ],
                comparison: {
                  bookings: 22.7,
                  revenue: 32.5,
                  attendance: 8.9
                }
              };
              break;
            default:
              return {
                status: 400,
                body: { error: 'Invalid period. Must be day, week, month, or year.' }
              };
          }
          
          return {
            status: 200,
            body: { 
              overview: overviewData,
              period
            }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Business not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error getting overview analytics:', error);
      return {
        status: 500,
        body: { error: 'Failed to get analytics overview' }
      };
    }
  }
  
  try {
    // Test case 1: Get weekly overview (default)
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/overview'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetOverviewAnalytics(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.overview || response1.body.period !== 'week') {
      throw new Error('Response should include overview data for weekly period');
    }
    
    console.log('✅ Successfully retrieved weekly overview analytics');
    
    // Test case 2: Get daily overview
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/overview', { period: 'day' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetOverviewAnalytics(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    if (!response2.body.overview || response2.body.period !== 'day') {
      throw new Error('Response should include overview data for daily period');
    }
    
    console.log('✅ Successfully retrieved daily overview analytics');
    
    // Test case 3: Invalid period
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/overview', { period: 'invalid' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleGetOverviewAnalytics(request3);
    
    if (response3.status !== 400) {
      throw new Error(`Expected status 400, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled invalid period');
    
    // Test case 4: Unauthorized request (no token)
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/overview'),
      method: 'GET'
    });
    
    const response4 = await handleGetOverviewAnalytics(request4);
    
    if (response4.status !== 401) {
      throw new Error(`Expected status 401, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get overview analytics endpoint:', error);
    return false;
  }
}

// Test get class analytics endpoint
async function testGetClassAnalyticsEndpoint() {
  console.log('\n📋 Testing GET /api/analytics/classes...');
  
  // Mock implementation of GET /api/analytics/classes endpoint
  async function handleGetClassAnalytics(request) {
    try {
      // Check for authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          status: 401,
          body: { error: 'Authentication required' }
        };
      }
      
      const token = authHeader.split(' ')[1];
      const userId = API.getUserIdFromToken(token);
      
      if (!userId) {
        return {
          status: 401,
          body: { error: 'Invalid token' }
        };
      }
      
      // Get query parameters
      const url = new URL(request.url);
      const period = url.searchParams.get('period') || 'month'; // Default to month
      const studioId = url.searchParams.get('studioId');
      const classId = url.searchParams.get('classId');
      
      // Get user data
      try {
        const user = await API.getUserById(userId);
        
        // Check if user is a business user
        if (user.role !== 'business') {
          return {
            status: 403,
            body: { error: 'Access denied. Business account required.' }
          };
        }
        
        // Check if business has analytics feature (premium plan)
        try {
          const business = await API.getBusinessByOwnerId(userId);
          
          if (business.plan !== 'premium') {
            return {
              status: 403,
              body: { error: 'Analytics features require a Premium plan. Please upgrade your subscription.' }
            };
          }
          
          // Validate studio if provided
          if (studioId) {
            try {
              const studio = await API.getDocument('studios', studioId);
              if (studio.businessId !== business.id) {
                return {
                  status: 403,
                  body: { error: 'Access denied. Studio does not belong to this business.' }
                };
              }
            } catch (error) {
              return {
                status: 404,
                body: { error: 'Studio not found' }
              };
            }
          }
          
          // Validate class if provided
          if (classId) {
            try {
              const classData = await API.getDocument('classes', classId);
              if (classData.businessId !== business.id) {
                return {
                  status: 403,
                  body: { error: 'Access denied. Class does not belong to this business.' }
                };
              }
            } catch (error) {
              return {
                status: 404,
                body: { error: 'Class not found' }
              };
            }
          }
          
          // Generate class analytics data
          // In a real implementation, this would be retrieved from the database
          
          let classAnalytics;
          
          if (classId) {
            // Analytics for a specific class
            classAnalytics = {
              attendance: {
                total: 198,
                average: 87.4,
                trend: [75, 80, 85, 90, 92, 88, 85, 90, 95, 92, 90, 85],
                comparisonWithPrevious: 5.2
              },
              bookings: {
                total: 226,
                average: 18.8,
                trend: [15, 16, 18, 20, 19, 17, 18, 21, 22, 20, 19, 21],
                comparisonWithPrevious: 7.8
              },
              capacity: {
                average: 87.4,
                trend: [75, 80, 85, 90, 92, 88, 85, 90, 95, 92, 90, 85]
              },
              revenue: {
                total: 4520,
                average: 376.67,
                trend: [300, 320, 360, 400, 380, 340, 360, 420, 440, 400, 380, 420],
                comparisonWithPrevious: 8.3
              }
            };
          } else {
            // Analytics for all classes or filtered by studio
            classAnalytics = {
              topClasses: [
                { name: 'Morning Yoga', bookings: 89, attendance: 84.2, revenue: 1780 },
                { name: 'Pilates Fusion', bookings: 76, attendance: 88.1, revenue: 1520 },
                { name: 'HIIT', bookings: 65, attendance: 92.5, revenue: 1300 },
                { name: 'Spin Class', bookings: 54, attendance: 86.3, revenue: 1080 },
                { name: 'CrossFit', bookings: 48, attendance: 91.7, revenue: 960 }
              ],
              categoryPerformance: [
                { category: 'Yoga', bookings: 140, attendance: 85.2, revenue: 2800 },
                { category: 'Cardio', bookings: 120, attendance: 89.5, revenue: 2400 },
                { category: 'Strength', bookings: 100, attendance: 92.3, revenue: 2000 },
                { category: 'Mind & Body', bookings: 80, attendance: 83.7, revenue: 1600 },
                { category: 'Dance', bookings: 60, attendance: 86.4, revenue: 1200 }
              ],
              timePerformance: [
                { time: 'Morning (6-9)', bookings: 180, attendance: 87.2, revenue: 3600 },
                { time: 'Midday (11-2)', bookings: 120, attendance: 82.5, revenue: 2400 },
                { time: 'Afternoon (3-5)', bookings: 100, attendance: 84.3, revenue: 2000 },
                { time: 'Evening (6-9)', bookings: 200, attendance: 91.8, revenue: 4000 }
              ],
              trends: {
                bookings: [150, 160, 175, 185, 180, 170, 175, 195, 205, 200, 190, 195],
                attendance: [82, 84, 86, 88, 89, 87, 85, 87, 90, 89, 88, 87],
                revenue: [3000, 3200, 3500, 3700, 3600, 3400, 3500, 3900, 4100, 4000, 3800, 3900]
              }
            };
          }
          
          return {
            status: 200,
            body: { 
              analytics: classAnalytics,
              period,
              filters: {
                studioId: studioId || null,
                classId: classId || null
              }
            }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Business not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error getting class analytics:', error);
      return {
        status: 500,
        body: { error: 'Failed to get class analytics' }
      };
    }
  }
  
  try {
    // Test case 1: Get analytics for all classes
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/classes'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetClassAnalytics(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.analytics || !response1.body.analytics.topClasses) {
      throw new Error('Response should include analytics data with topClasses');
    }
    
    console.log('✅ Successfully retrieved analytics for all classes');
    
    // Test case 2: Get analytics for a specific class
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/classes', { classId: 'class-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetClassAnalytics(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    if (!response2.body.analytics || !response2.body.analytics.attendance) {
      throw new Error('Response should include analytics data with attendance');
    }
    
    console.log('✅ Successfully retrieved analytics for a specific class');
    
    // Test case 3: Get analytics for a specific studio
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/classes', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleGetClassAnalytics(request3);
    
    if (response3.status !== 200) {
      throw new Error(`Expected status 200, got ${response3.status}`);
    }
    
    console.log('✅ Successfully retrieved analytics for a specific studio');
    
    // Test case 4: Unauthorized request (no token)
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/classes'),
      method: 'GET'
    });
    
    const response4 = await handleGetClassAnalytics(request4);
    
    if (response4.status !== 401) {
      throw new Error(`Expected status 401, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get class analytics endpoint:', error);
    return false;
  }
}

// Test get financial analytics endpoint
async function testGetFinancialAnalyticsEndpoint() {
  console.log('\n📋 Testing GET /api/analytics/financial...');
  
  // Mock implementation of GET /api/analytics/financial endpoint
  async function handleGetFinancialAnalytics(request) {
    try {
      // Check for authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          status: 401,
          body: { error: 'Authentication required' }
        };
      }
      
      const token = authHeader.split(' ')[1];
      const userId = API.getUserIdFromToken(token);
      
      if (!userId) {
        return {
          status: 401,
          body: { error: 'Invalid token' }
        };
      }
      
      // Get query parameters
      const url = new URL(request.url);
      const period = url.searchParams.get('period') || 'month'; // Default to month
      const studioId = url.searchParams.get('studioId');
      
      // Get user data
      try {
        const user = await API.getUserById(userId);
        
        // Check if user is a business user
        if (user.role !== 'business') {
          return {
            status: 403,
            body: { error: 'Access denied. Business account required.' }
          };
        }
        
        // Check if business has analytics feature (premium plan)
        try {
          const business = await API.getBusinessByOwnerId(userId);
          
          if (business.plan !== 'premium') {
            return {
              status: 403,
              body: { error: 'Analytics features require a Premium plan. Please upgrade your subscription.' }
            };
          }
          
          // Validate studio if provided
          if (studioId) {
            try {
              const studio = await API.getDocument('studios', studioId);
              if (studio.businessId !== business.id) {
                return {
                  status: 403,
                  body: { error: 'Access denied. Studio does not belong to this business.' }
                };
              }
            } catch (error) {
              return {
                status: 404,
                body: { error: 'Studio not found' }
              };
            }
          }
          
          // Generate financial analytics data
          // In a real implementation, this would be retrieved from the database
          
          let financialAnalytics;
          
          switch (period) {
            case 'week':
              financialAnalytics = {
                revenue: {
                  total: 2345.00,
                  byDay: [310, 290, 350, 400, 380, 335, 280],
                  comparisonWithPrevious: 7.6
                },
                paymentMethods: {
                  creditCard: 1407,
                  debitCard: 703.5,
                  cash: 234.5
                },
                packageTypes: {
                  singleClass: 937.5,
                  membership: 1172.5,
                  privateSessions: 234.5
                },
                outstandingPayments: 175.50
              };
              break;
            case 'month':
              financialAnalytics = {
                revenue: {
                  total: 9876.00,
                  byWeek: [2345, 2450, 2575, 2506],
                  comparisonWithPrevious: 15.2
                },
                paymentMethods: {
                  creditCard: 5925.6,
                  debitCard: 2962.8,
                  cash: 987.6
                },
                packageTypes: {
                  singleClass: 3950.4,
                  membership: 4938,
                  privateSessions: 987.6
                },
                outstandingPayments: 475.25
              };
              break;
            case 'quarter':
              financialAnalytics = {
                revenue: {
                  total: 29784.00,
                  byMonth: [9876, 9945, 9963],
                  comparisonWithPrevious: 18.5
                },
                paymentMethods: {
                  creditCard: 17870.4,
                  debitCard: 8935.2,
                  cash: 2978.4
                },
                packageTypes: {
                  singleClass: 11913.6,
                  membership: 14892,
                  privateSessions: 2978.4
                },
                outstandingPayments: 1250.75
              };
              break;
            case 'year':
              financialAnalytics = {
                revenue: {
                  total: 120987.00,
                  byQuarter: [29784, 30100, 30250, 30853],
                  comparisonWithPrevious: 32.5
                },
                paymentMethods: {
                  creditCard: 72592.2,
                  debitCard: 36296.1,
                  cash: 12098.7
                },
                packageTypes: {
                  singleClass: 48394.8,
                  membership: 60493.5,
                  privateSessions: 12098.7
                },
                outstandingPayments: 3625.50
              };
              break;
            default:
              return {
                status: 400,
                body: { error: 'Invalid period. Must be week, month, quarter, or year.' }
              };
          }
          
          return {
            status: 200,
            body: { 
              analytics: financialAnalytics,
              period,
              filters: {
                studioId: studioId || null
              }
            }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Business not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error getting financial analytics:', error);
      return {
        status: 500,
        body: { error: 'Failed to get financial analytics' }
      };
    }
  }
  
  try {
    // Test case 1: Get monthly financial analytics (default)
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/financial'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetFinancialAnalytics(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.analytics || !response1.body.analytics.revenue) {
      throw new Error('Response should include analytics data with revenue');
    }
    
    console.log('✅ Successfully retrieved monthly financial analytics');
    
    // Test case 2: Get weekly financial analytics
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/financial', { period: 'week' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetFinancialAnalytics(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    if (!response2.body.analytics.revenue.byDay) {
      throw new Error('Weekly analytics should include revenue by day');
    }
    
    console.log('✅ Successfully retrieved weekly financial analytics');
    
    // Test case 3: Get financial analytics for a specific studio
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/financial', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleGetFinancialAnalytics(request3);
    
    if (response3.status !== 200) {
      throw new Error(`Expected status 200, got ${response3.status}`);
    }
    
    console.log('✅ Successfully retrieved financial analytics for a specific studio');
    
    // Test case 4: Invalid period
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/financial', { period: 'invalid' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response4 = await handleGetFinancialAnalytics(request4);
    
    if (response4.status !== 400) {
      throw new Error(`Expected status 400, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled invalid period');
    
    // Test case 5: Unauthorized request (no token)
    const request5 = new MockExpoRequest({
      url: createRequestUrl('/api/analytics/financial'),
      method: 'GET'
    });
    
    const response5 = await handleGetFinancialAnalytics(request5);
    
    if (response5.status !== 401) {
      throw new Error(`Expected status 401, got ${response5.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get financial analytics endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getOverviewAnalyticsResult = await testGetOverviewAnalyticsEndpoint();
    const getClassAnalyticsResult = await testGetClassAnalyticsEndpoint();
    const getFinancialAnalyticsResult = await testGetFinancialAnalyticsEndpoint();
    
    if (getOverviewAnalyticsResult && getClassAnalyticsResult && getFinancialAnalyticsResult) {
      console.log('\n🎉 All Analytics API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Analytics API Endpoint tests failed!');
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