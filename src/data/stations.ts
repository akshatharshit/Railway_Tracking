import { Station } from '@/lib/types';

export const stations: Station[] = [
    { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', zone: 'NR', lat: 28.6419, lng: 77.2193, platforms: 16, isJunction: true },
    { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR', lat: 18.9712, lng: 72.8194, platforms: 10, isJunction: true },
    { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', lat: 18.9402, lng: 72.8356, platforms: 18, isJunction: true },
    { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'ER', lat: 22.5839, lng: 88.3428, platforms: 23, isJunction: true },
    { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', lat: 13.0827, lng: 80.2707, platforms: 17, isJunction: true },
    { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', lat: 12.9784, lng: 77.5713, platforms: 10, isJunction: true },
    { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', lat: 17.3616, lng: 78.4747, platforms: 6, isJunction: false },
    { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', lat: 17.4344, lng: 78.5013, platforms: 10, isJunction: true },
    { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR', lat: 26.9194, lng: 75.7876, platforms: 6, isJunction: true },
    { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR', lat: 23.0225, lng: 72.5714, platforms: 12, isJunction: true },
    { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NR', lat: 26.8295, lng: 80.9238, platforms: 9, isJunction: true },
    { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'NCR', lat: 26.4612, lng: 80.3504, platforms: 10, isJunction: true },
    { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', zone: 'ECR', lat: 25.6091, lng: 85.1349, platforms: 10, isJunction: true },
    { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR', lat: 23.2683, lng: 77.4124, platforms: 6, isJunction: true },
    { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'CR', lat: 21.1502, lng: 79.0882, platforms: 8, isJunction: true },
    { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'CR', lat: 18.5285, lng: 73.8743, platforms: 6, isJunction: true },
    { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR', lat: 27.1631, lng: 78.0154, platforms: 7, isJunction: false },
    { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'NCR', lat: 26.2124, lng: 78.1855, platforms: 5, isJunction: true },
    { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', zone: 'WR', lat: 22.3101, lng: 73.1814, platforms: 7, isJunction: true },
    { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', zone: 'WR', lat: 21.2050, lng: 72.8418, platforms: 5, isJunction: false },
    { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR', lat: 20.2710, lng: 85.8398, platforms: 6, isJunction: false },
    { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'ECoR', lat: 17.7216, lng: 83.2885, platforms: 8, isJunction: true },
    { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'SR', lat: 8.4892, lng: 76.9521, platforms: 5, isJunction: false },
    { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala', zone: 'SR', lat: 9.9684, lng: 76.2883, platforms: 6, isJunction: true },
    { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR', lat: 10.9964, lng: 76.9672, platforms: 6, isJunction: true },
    { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu', zone: 'SR', lat: 9.9209, lng: 78.1189, platforms: 5, isJunction: true },
    { code: 'CDG', name: 'Chandigarh', city: 'Chandigarh', state: 'Punjab', zone: 'NR', lat: 30.6935, lng: 76.8083, platforms: 5, isJunction: false },
    { code: 'DDN', name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand', zone: 'NR', lat: 30.3228, lng: 78.0444, platforms: 5, isJunction: false },
    { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', zone: 'NER', lat: 26.7468, lng: 83.3673, platforms: 10, isJunction: true },
    { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NR', lat: 25.3228, lng: 83.0076, platforms: 9, isJunction: true },
    { code: 'ALD', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh', zone: 'NCR', lat: 25.4300, lng: 81.8360, platforms: 10, isJunction: true },
    { code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad', state: 'Jharkhand', zone: 'ECR', lat: 23.7910, lng: 86.4309, platforms: 7, isJunction: true },
    { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand', zone: 'SER', lat: 23.3489, lng: 85.3213, platforms: 5, isJunction: true },
    { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', zone: 'NFR', lat: 26.1870, lng: 91.7400, platforms: 5, isJunction: false },
    { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'J&K', zone: 'NR', lat: 32.7332, lng: 74.8719, platforms: 5, isJunction: false },
    { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan', zone: 'NWR', lat: 24.5806, lng: 73.6894, platforms: 4, isJunction: false },
    { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan', zone: 'NWR', lat: 26.2871, lng: 73.0186, platforms: 6, isJunction: true },
    { code: 'AJJ', name: 'Arakkonam Junction', city: 'Arakkonam', state: 'Tamil Nadu', zone: 'SR', lat: 13.0785, lng: 79.6661, platforms: 5, isJunction: true },
    { code: 'KGP', name: 'Kharagpur Junction', city: 'Kharagpur', state: 'West Bengal', zone: 'SER', lat: 22.3316, lng: 87.3124, platforms: 12, isJunction: true },
    { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', zone: 'SCR', lat: 13.6335, lng: 79.4190, platforms: 5, isJunction: false },
    { code: 'RJT', name: 'Rajkot Junction', city: 'Rajkot', state: 'Gujarat', zone: 'WR', lat: 22.3098, lng: 70.7954, platforms: 5, isJunction: true },
    { code: 'UMB', name: 'Ambala Cantt Junction', city: 'Ambala', state: 'Haryana', zone: 'NR', lat: 30.3745, lng: 76.8139, platforms: 8, isJunction: true },
    { code: 'MGS', name: 'Mughal Sarai Junction', city: 'Mughal Sarai', state: 'Uttar Pradesh', zone: 'ECR', lat: 25.2800, lng: 83.1226, platforms: 8, isJunction: true },
    { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'New Delhi', state: 'Delhi', zone: 'NR', lat: 28.5895, lng: 77.2510, platforms: 7, isJunction: false },
    { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', lat: 19.0685, lng: 72.8891, platforms: 9, isJunction: false },
    { code: 'SNSI', name: 'Sainagar Shirdi', city: 'Shirdi', state: 'Maharashtra', zone: 'CR', lat: 19.7666, lng: 74.4815, platforms: 3, isJunction: false },
    { code: 'KYN', name: 'Kalyan Junction', city: 'Kalyan', state: 'Maharashtra', zone: 'CR', lat: 19.2437, lng: 73.1355, platforms: 8, isJunction: true },
    { code: 'ITJ', name: 'Itarsi Junction', city: 'Itarsi', state: 'Madhya Pradesh', zone: 'WCR', lat: 22.6150, lng: 77.7652, platforms: 7, isJunction: true },
];

export function findStation(code: string): Station | undefined {
    return stations.find(s => s.code === code);
}

export function searchStations(query: string): Station[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return stations.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
    ).slice(0, 10);
}
