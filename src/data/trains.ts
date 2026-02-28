import { Train } from '@/lib/types';

export const trains: Train[] = [
    {
        number: '12301', name: 'Howrah Rajdhani Express', category: 'Rajdhani',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'HWH', totalDistance: 1447, avgSpeed: 82, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '16:55', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 16 },
            { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '21:15', departureTime: '21:25', haltMinutes: 10, distanceFromSource: 440, dayNumber: 1, platform: 1 },
            { stationCode: 'ALD', stationName: 'Prayagraj Junction', arrivalTime: '23:10', departureTime: '23:20', haltMinutes: 10, distanceFromSource: 634, dayNumber: 1, platform: 6 },
            { stationCode: 'MGS', stationName: 'Mughal Sarai Jn', arrivalTime: '01:10', departureTime: '01:20', haltMinutes: 10, distanceFromSource: 780, dayNumber: 2, platform: 1 },
            { stationCode: 'DHN', stationName: 'Dhanbad Junction', arrivalTime: '04:33', departureTime: '04:38', haltMinutes: 5, distanceFromSource: 1135, dayNumber: 2, platform: 3 },
            { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '09:55', departureTime: '--', haltMinutes: 0, distanceFromSource: 1447, dayNumber: 2, platform: 9 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 4215, available: true },
            { trainClass: '2AC', baseFare: 2540, available: true },
            { trainClass: '3AC', baseFare: 1780, available: true },
        ],
    },
    {
        number: '12951', name: 'Mumbai Rajdhani Express', category: 'Rajdhani',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'BCT', destinationCode: 'NDLS', totalDistance: 1384, avgSpeed: 88, pantryAvailable: true,
        stops: [
            { stationCode: 'BCT', stationName: 'Mumbai Central', arrivalTime: '--', departureTime: '17:00', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 4 },
            { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '21:20', departureTime: '21:25', haltMinutes: 5, distanceFromSource: 392, dayNumber: 1, platform: 3 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '02:15', departureTime: '02:20', haltMinutes: 5, distanceFromSource: 860, dayNumber: 2, platform: 1 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '06:00', departureTime: '06:05', haltMinutes: 5, distanceFromSource: 1188, dayNumber: 2, platform: 1 },
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '08:35', departureTime: '--', haltMinutes: 0, distanceFromSource: 1384, dayNumber: 2, platform: 5 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 4045, available: true },
            { trainClass: '2AC', baseFare: 2380, available: true },
            { trainClass: '3AC', baseFare: 1655, available: true },
        ],
    },
    {
        number: '12002', name: 'Bhopal Shatabdi Express', category: 'Shatabdi',
        classes: ['CC', 'EC'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        sourceCode: 'NDLS', destinationCode: 'BPL', totalDistance: 704, avgSpeed: 91, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '06:15', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 1 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '08:12', departureTime: '08:15', haltMinutes: 3, distanceFromSource: 195, dayNumber: 1, platform: 1 },
            { stationCode: 'GWL', stationName: 'Gwalior Junction', arrivalTime: '09:28', departureTime: '09:30', haltMinutes: 2, distanceFromSource: 317, dayNumber: 1, platform: 1 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '13:55', departureTime: '--', haltMinutes: 0, distanceFromSource: 704, dayNumber: 1, platform: 6 },
        ],
        fares: [
            { trainClass: 'CC', baseFare: 1110, available: true },
            { trainClass: 'EC', baseFare: 2130, available: true },
        ],
    },
    {
        number: '12259', name: 'Sealdah Duronto Express', category: 'Duronto',
        classes: ['1AC', '2AC', '3AC', 'SL'], runningDays: ['Mon', 'Wed', 'Sat'],
        sourceCode: 'NDLS', destinationCode: 'HWH', totalDistance: 1453, avgSpeed: 86, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '20:15', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 8 },
            { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '13:10', departureTime: '--', haltMinutes: 0, distanceFromSource: 1453, dayNumber: 2, platform: 5 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 4535, available: true },
            { trainClass: '2AC', baseFare: 2695, available: true },
            { trainClass: '3AC', baseFare: 1890, available: true },
            { trainClass: 'SL', baseFare: 715, available: true },
        ],
    },
    {
        number: '12627', name: 'Karnataka Express', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'SBC', totalDistance: 2444, avgSpeed: 56, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '21:15', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 7 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '00:40', departureTime: '00:45', haltMinutes: 5, distanceFromSource: 195, dayNumber: 2 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '07:50', departureTime: '08:00', haltMinutes: 10, distanceFromSource: 704, dayNumber: 2 },
            { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '14:50', departureTime: '15:00', haltMinutes: 10, distanceFromSource: 1094, dayNumber: 2 },
            { stationCode: 'SC', stationName: 'Secunderabad Jn', arrivalTime: '22:10', departureTime: '22:30', haltMinutes: 20, distanceFromSource: 1654, dayNumber: 2, platform: 1 },
            { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '06:20', departureTime: '--', haltMinutes: 0, distanceFromSource: 2444, dayNumber: 3, platform: 1 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 3065, available: true },
            { trainClass: '3AC', baseFare: 1255, available: true },
            { trainClass: 'SL', baseFare: 470, available: true },
            { trainClass: 'GN', baseFare: 280, available: false },
        ],
    },
    {
        number: '12723', name: 'Telangana Express', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'SC', totalDistance: 1654, avgSpeed: 60, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '06:50', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 14 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '09:52', departureTime: '09:57', haltMinutes: 5, distanceFromSource: 195, dayNumber: 1 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '16:50', departureTime: '17:00', haltMinutes: 10, distanceFromSource: 704, dayNumber: 1, platform: 3 },
            { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '23:40', departureTime: '23:55', haltMinutes: 15, distanceFromSource: 1094, dayNumber: 1 },
            { stationCode: 'SC', stationName: 'Secunderabad Jn', arrivalTime: '08:00', departureTime: '--', haltMinutes: 0, distanceFromSource: 1654, dayNumber: 2, platform: 10 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 2190, available: true },
            { trainClass: '3AC', baseFare: 890, available: true },
            { trainClass: 'SL', baseFare: 345, available: true },
            { trainClass: 'GN', baseFare: 210, available: false },
        ],
    },
    {
        number: '12622', name: 'Tamil Nadu Express', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'MAS', totalDistance: 2182, avgSpeed: 62, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '22:30', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 5 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '01:30', departureTime: '01:35', haltMinutes: 5, distanceFromSource: 195, dayNumber: 2 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '08:20', departureTime: '08:30', haltMinutes: 10, distanceFromSource: 704, dayNumber: 2 },
            { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '15:10', departureTime: '15:25', haltMinutes: 15, distanceFromSource: 1094, dayNumber: 2 },
            { stationCode: 'BBS', stationName: 'Bhubaneswar', arrivalTime: '04:00', departureTime: '04:10', haltMinutes: 10, distanceFromSource: 1750, dayNumber: 3 },
            { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '07:10', departureTime: '--', haltMinutes: 0, distanceFromSource: 2182, dayNumber: 3, platform: 7 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 2830, available: true },
            { trainClass: '3AC', baseFare: 1160, available: true },
            { trainClass: 'SL', baseFare: 435, available: true },
            { trainClass: 'GN', baseFare: 255, available: false },
        ],
    },
    {
        number: '12431', name: 'Thiruvananthapuram Rajdhani Express', category: 'Rajdhani',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Wed', 'Fri'],
        sourceCode: 'NZM', destinationCode: 'TVC', totalDistance: 3036, avgSpeed: 62, pantryAvailable: true,
        stops: [
            { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '--', departureTime: '11:00', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 4 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '19:30', departureTime: '19:40', haltMinutes: 10, distanceFromSource: 704, dayNumber: 1 },
            { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '02:00', departureTime: '02:10', haltMinutes: 10, distanceFromSource: 1094, dayNumber: 2 },
            { stationCode: 'SC', stationName: 'Secunderabad Jn', arrivalTime: '10:00', departureTime: '10:15', haltMinutes: 15, distanceFromSource: 1654, dayNumber: 2 },
            { stationCode: 'ERS', stationName: 'Ernakulam Junction', arrivalTime: '03:30', departureTime: '03:40', haltMinutes: 10, distanceFromSource: 2700, dayNumber: 3, platform: 2 },
            { stationCode: 'TVC', stationName: 'Thiruvananthapuram Central', arrivalTime: '08:00', departureTime: '--', haltMinutes: 0, distanceFromSource: 3036, dayNumber: 3, platform: 1 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 5850, available: true },
            { trainClass: '2AC', baseFare: 3450, available: true },
            { trainClass: '3AC', baseFare: 2405, available: true },
        ],
    },
    {
        number: '12625', name: 'Kerala Express', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'TVC', totalDistance: 3040, avgSpeed: 54, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '11:25', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 9 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '14:28', departureTime: '14:33', haltMinutes: 5, distanceFromSource: 195, dayNumber: 1 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '22:05', departureTime: '22:15', haltMinutes: 10, distanceFromSource: 704, dayNumber: 1 },
            { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '04:30', departureTime: '04:45', haltMinutes: 15, distanceFromSource: 1094, dayNumber: 2 },
            { stationCode: 'CBE', stationName: 'Coimbatore Junction', arrivalTime: '06:00', departureTime: '06:15', haltMinutes: 15, distanceFromSource: 2510, dayNumber: 3 },
            { stationCode: 'ERS', stationName: 'Ernakulam Junction', arrivalTime: '10:50', departureTime: '11:00', haltMinutes: 10, distanceFromSource: 2700, dayNumber: 3, platform: 3 },
            { stationCode: 'TVC', stationName: 'Thiruvananthapuram Central', arrivalTime: '18:30', departureTime: '--', haltMinutes: 0, distanceFromSource: 3040, dayNumber: 3, platform: 1 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 3350, available: true },
            { trainClass: '3AC', baseFare: 1375, available: true },
            { trainClass: 'SL', baseFare: 515, available: true },
            { trainClass: 'GN', baseFare: 310, available: false },
        ],
    },
    {
        number: '22691', name: 'KSR Bengaluru Rajdhani Express', category: 'Rajdhani',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'SBC', totalDistance: 2444, avgSpeed: 70, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '20:50', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 2 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '23:20', departureTime: '23:25', haltMinutes: 5, distanceFromSource: 195, dayNumber: 1 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '04:55', departureTime: '05:00', haltMinutes: 5, distanceFromSource: 704, dayNumber: 2 },
            { stationCode: 'SC', stationName: 'Secunderabad Jn', arrivalTime: '15:45', departureTime: '16:05', haltMinutes: 20, distanceFromSource: 1654, dayNumber: 2, platform: 1 },
            { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '06:10', departureTime: '--', haltMinutes: 0, distanceFromSource: 2444, dayNumber: 3, platform: 1 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 5640, available: true },
            { trainClass: '2AC', baseFare: 3250, available: true },
            { trainClass: '3AC', baseFare: 2265, available: true },
        ],
    },
    {
        number: '12903', name: 'Golden Temple Mail Express', category: 'Mail',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'BCT', destinationCode: 'NDLS', totalDistance: 1384, avgSpeed: 55, pantryAvailable: true,
        stops: [
            { stationCode: 'BCT', stationName: 'Mumbai Central', arrivalTime: '--', departureTime: '21:25', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 6 },
            { stationCode: 'ST', stationName: 'Surat', arrivalTime: '01:35', departureTime: '01:40', haltMinutes: 5, distanceFromSource: 263, dayNumber: 2 },
            { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '03:45', departureTime: '03:50', haltMinutes: 5, distanceFromSource: 392, dayNumber: 2, platform: 2 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '12:45', departureTime: '12:55', haltMinutes: 10, distanceFromSource: 860, dayNumber: 2, platform: 5 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '18:50', departureTime: '18:55', haltMinutes: 5, distanceFromSource: 1188, dayNumber: 2 },
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '22:55', departureTime: '--', haltMinutes: 0, distanceFromSource: 1384, dayNumber: 2, platform: 13 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 1835, available: true },
            { trainClass: '3AC', baseFare: 750, available: true },
            { trainClass: 'SL', baseFare: 280, available: true },
            { trainClass: 'GN', baseFare: 165, available: false },
        ],
    },
    {
        number: '12311', name: 'Kalka Mail', category: 'Mail',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'HWH', destinationCode: 'NDLS', totalDistance: 1447, avgSpeed: 55, pantryAvailable: true,
        stops: [
            { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '--', departureTime: '19:40', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 14 },
            { stationCode: 'DHN', stationName: 'Dhanbad Junction', arrivalTime: '23:30', departureTime: '23:40', haltMinutes: 10, distanceFromSource: 312, dayNumber: 1 },
            { stationCode: 'MGS', stationName: 'Mughal Sarai Jn', arrivalTime: '04:35', departureTime: '04:50', haltMinutes: 15, distanceFromSource: 667, dayNumber: 2 },
            { stationCode: 'ALD', stationName: 'Prayagraj Junction', arrivalTime: '06:50', departureTime: '07:00', haltMinutes: 10, distanceFromSource: 813, dayNumber: 2 },
            { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '10:05', departureTime: '10:20', haltMinutes: 15, distanceFromSource: 1007, dayNumber: 2, platform: 8 },
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '22:30', departureTime: '--', haltMinutes: 0, distanceFromSource: 1447, dayNumber: 2, platform: 4 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 1920, available: true },
            { trainClass: '3AC', baseFare: 785, available: true },
            { trainClass: 'SL', baseFare: 295, available: true },
            { trainClass: 'GN', baseFare: 175, available: false },
        ],
    },
    {
        number: '12839', name: 'Chennai Mail', category: 'Mail',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'HWH', destinationCode: 'MAS', totalDistance: 1663, avgSpeed: 57, pantryAvailable: true,
        stops: [
            { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '--', departureTime: '23:50', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 2 },
            { stationCode: 'KGP', stationName: 'Kharagpur Junction', arrivalTime: '01:57', departureTime: '02:00', haltMinutes: 3, distanceFromSource: 115, dayNumber: 2, platform: 3 },
            { stationCode: 'BBS', stationName: 'Bhubaneswar', arrivalTime: '06:55', departureTime: '07:05', haltMinutes: 10, distanceFromSource: 448, dayNumber: 2 },
            { stationCode: 'VSKP', stationName: 'Visakhapatnam Jn', arrivalTime: '12:40', departureTime: '12:55', haltMinutes: 15, distanceFromSource: 846, dayNumber: 2, platform: 1 },
            { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '04:30', departureTime: '--', haltMinutes: 0, distanceFromSource: 1663, dayNumber: 3, platform: 11 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 2310, available: true },
            { trainClass: '3AC', baseFare: 940, available: true },
            { trainClass: 'SL', baseFare: 355, available: true },
            { trainClass: 'GN', baseFare: 205, available: false },
        ],
    },
    {
        number: '12049', name: 'Gatimaan Express', category: 'Vande Bharat',
        classes: ['CC', 'EC'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        sourceCode: 'NZM', destinationCode: 'AGC', totalDistance: 188, avgSpeed: 118, pantryAvailable: true,
        stops: [
            { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '--', departureTime: '08:10', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 2 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '09:50', departureTime: '--', haltMinutes: 0, distanceFromSource: 188, dayNumber: 1, platform: 1 },
        ],
        fares: [
            { trainClass: 'CC', baseFare: 755, available: true },
            { trainClass: 'EC', baseFare: 1505, available: true },
        ],
    },
    {
        number: '22435', name: 'Vande Bharat Express (NDLS-BSB)', category: 'Vande Bharat',
        classes: ['CC', 'EC'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        sourceCode: 'NDLS', destinationCode: 'BSB', totalDistance: 759, avgSpeed: 95, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '06:00', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 1 },
            { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '09:40', departureTime: '09:45', haltMinutes: 5, distanceFromSource: 440, dayNumber: 1 },
            { stationCode: 'ALD', stationName: 'Prayagraj Junction', arrivalTime: '11:30', departureTime: '11:35', haltMinutes: 5, distanceFromSource: 634, dayNumber: 1 },
            { stationCode: 'BSB', stationName: 'Varanasi Junction', arrivalTime: '14:00', departureTime: '--', haltMinutes: 0, distanceFromSource: 759, dayNumber: 1, platform: 1 },
        ],
        fares: [
            { trainClass: 'CC', baseFare: 1365, available: true },
            { trainClass: 'EC', baseFare: 2505, available: true },
        ],
    },
    {
        number: '12305', name: 'Kolkata Rajdhani Express', category: 'Rajdhani',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'HWH', totalDistance: 1447, avgSpeed: 82, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '17:00', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 3 },
            { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '21:30', departureTime: '21:35', haltMinutes: 5, distanceFromSource: 440, dayNumber: 1, platform: 1 },
            { stationCode: 'MGS', stationName: 'Mughal Sarai Jn', arrivalTime: '01:30', departureTime: '01:35', haltMinutes: 5, distanceFromSource: 780, dayNumber: 2 },
            { stationCode: 'DHN', stationName: 'Dhanbad Junction', arrivalTime: '04:45', departureTime: '04:50', haltMinutes: 5, distanceFromSource: 1135, dayNumber: 2, platform: 1 },
            { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '10:00', departureTime: '--', haltMinutes: 0, distanceFromSource: 1447, dayNumber: 2, platform: 7 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 4215, available: true },
            { trainClass: '2AC', baseFare: 2540, available: true },
            { trainClass: '3AC', baseFare: 1780, available: true },
        ],
    },
    {
        number: '12952', name: 'New Delhi Mumbai Rajdhani Express', category: 'Rajdhani',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'BCT', totalDistance: 1384, avgSpeed: 88, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '16:25', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 12 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '18:15', departureTime: '18:20', haltMinutes: 5, distanceFromSource: 196, dayNumber: 1 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '23:40', departureTime: '23:45', haltMinutes: 5, distanceFromSource: 704, dayNumber: 1, platform: 1 },
            { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '04:55', departureTime: '05:00', haltMinutes: 5, distanceFromSource: 992, dayNumber: 2 },
            { stationCode: 'BCT', stationName: 'Mumbai Central', arrivalTime: '08:15', departureTime: '--', haltMinutes: 0, distanceFromSource: 1384, dayNumber: 2, platform: 1 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 4045, available: true },
            { trainClass: '2AC', baseFare: 2380, available: true },
            { trainClass: '3AC', baseFare: 1655, available: true },
        ],
    },
    {
        number: '12263', name: 'Pune Duronto Express', category: 'Duronto',
        classes: ['2AC', '3AC', 'SL'], runningDays: ['Tue', 'Thu', 'Sun'],
        sourceCode: 'NZM', destinationCode: 'PUNE', totalDistance: 1498, avgSpeed: 72, pantryAvailable: true,
        stops: [
            { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '--', departureTime: '15:30', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 7 },
            { stationCode: 'PUNE', stationName: 'Pune Junction', arrivalTime: '09:05', departureTime: '--', haltMinutes: 0, distanceFromSource: 1498, dayNumber: 2, platform: 1 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 2200, available: true },
            { trainClass: '3AC', baseFare: 1485, available: true },
            { trainClass: 'SL', baseFare: 555, available: true },
        ],
    },
    {
        number: '12245', name: 'Howrah Duronto Express', category: 'Duronto',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Tue', 'Thu', 'Sat'],
        sourceCode: 'HWH', destinationCode: 'NDLS', totalDistance: 1447, avgSpeed: 85, pantryAvailable: true,
        stops: [
            { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '--', departureTime: '20:05', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 11 },
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '10:00', departureTime: '--', haltMinutes: 0, distanceFromSource: 1447, dayNumber: 2, platform: 10 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 4535, available: true },
            { trainClass: '2AC', baseFare: 2695, available: true },
            { trainClass: '3AC', baseFare: 1890, available: true },
        ],
    },
    {
        number: '12309', name: 'Rajdhani Express (Patna)', category: 'Rajdhani',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'PNBE', totalDistance: 1001, avgSpeed: 72, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '17:30', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 11 },
            { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '21:50', departureTime: '21:55', haltMinutes: 5, distanceFromSource: 440, dayNumber: 1, platform: 1 },
            { stationCode: 'ALD', stationName: 'Prayagraj Junction', arrivalTime: '00:00', departureTime: '00:05', haltMinutes: 5, distanceFromSource: 634, dayNumber: 2 },
            { stationCode: 'MGS', stationName: 'Mughal Sarai Jn', arrivalTime: '02:00', departureTime: '02:10', haltMinutes: 10, distanceFromSource: 780, dayNumber: 2 },
            { stationCode: 'PNBE', stationName: 'Patna Junction', arrivalTime: '07:30', departureTime: '--', haltMinutes: 0, distanceFromSource: 1001, dayNumber: 2, platform: 2 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 3200, available: true },
            { trainClass: '2AC', baseFare: 1895, available: true },
            { trainClass: '3AC', baseFare: 1320, available: true },
        ],
    },
    {
        number: '12565', name: 'Bihar Sampark Kranti Express', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'PNBE', totalDistance: 1001, avgSpeed: 52, pantryAvailable: false,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '14:50', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 3 },
            { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '20:40', departureTime: '20:50', haltMinutes: 10, distanceFromSource: 440, dayNumber: 1, platform: 3 },
            { stationCode: 'ALD', stationName: 'Prayagraj Junction', arrivalTime: '23:30', departureTime: '23:40', haltMinutes: 10, distanceFromSource: 634, dayNumber: 1 },
            { stationCode: 'MGS', stationName: 'Mughal Sarai Jn', arrivalTime: '02:20', departureTime: '02:30', haltMinutes: 10, distanceFromSource: 780, dayNumber: 2 },
            { stationCode: 'PNBE', stationName: 'Patna Junction', arrivalTime: '08:55', departureTime: '--', haltMinutes: 0, distanceFromSource: 1001, dayNumber: 2, platform: 7 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 1420, available: true },
            { trainClass: '3AC', baseFare: 575, available: true },
            { trainClass: 'SL', baseFare: 215, available: true },
            { trainClass: 'GN', baseFare: 125, available: false },
        ],
    },
    {
        number: '12621', name: 'Tamil Nadu Superfast Express (Return)', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'MAS', destinationCode: 'NDLS', totalDistance: 2182, avgSpeed: 62, pantryAvailable: true,
        stops: [
            { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '--', departureTime: '22:00', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 5 },
            { stationCode: 'VSKP', stationName: 'Visakhapatnam Jn', arrivalTime: '12:50', departureTime: '13:00', haltMinutes: 10, distanceFromSource: 800, dayNumber: 2 },
            { stationCode: 'BBS', stationName: 'Bhubaneswar', arrivalTime: '20:00', departureTime: '20:10', haltMinutes: 10, distanceFromSource: 1200, dayNumber: 2 },
            { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '10:50', departureTime: '11:05', haltMinutes: 15, distanceFromSource: 1700, dayNumber: 3 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '17:30', departureTime: '17:40', haltMinutes: 10, distanceFromSource: 1900, dayNumber: 3 },
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:30', departureTime: '--', haltMinutes: 0, distanceFromSource: 2182, dayNumber: 4, platform: 5 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 2830, available: true },
            { trainClass: '3AC', baseFare: 1160, available: true },
            { trainClass: 'SL', baseFare: 435, available: true },
            { trainClass: 'GN', baseFare: 255, available: false },
        ],
    },
    {
        number: '12505', name: 'North East Express', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'NDLS', destinationCode: 'GHY', totalDistance: 1932, avgSpeed: 55, pantryAvailable: true,
        stops: [
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '--', departureTime: '15:45', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 6 },
            { stationCode: 'LKO', stationName: 'Lucknow Charbagh', arrivalTime: '22:20', departureTime: '22:35', haltMinutes: 15, distanceFromSource: 512, dayNumber: 1 },
            { stationCode: 'GKP', stationName: 'Gorakhpur Junction', arrivalTime: '03:30', departureTime: '03:40', haltMinutes: 10, distanceFromSource: 810, dayNumber: 2 },
            { stationCode: 'PNBE', stationName: 'Patna Junction', arrivalTime: '10:15', departureTime: '10:20', haltMinutes: 5, distanceFromSource: 1060, dayNumber: 2, platform: 9 },
            { stationCode: 'GHY', stationName: 'Guwahati', arrivalTime: '04:00', departureTime: '--', haltMinutes: 0, distanceFromSource: 1932, dayNumber: 3, platform: 1 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 2595, available: true },
            { trainClass: '3AC', baseFare: 1065, available: true },
            { trainClass: 'SL', baseFare: 400, available: true },
            { trainClass: 'GN', baseFare: 235, available: false },
        ],
    },
    {
        number: '12956', name: 'Jaipur Superfast Express', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'BCT', destinationCode: 'JP', totalDistance: 1112, avgSpeed: 58, pantryAvailable: false,
        stops: [
            { stationCode: 'BCT', stationName: 'Mumbai Central', arrivalTime: '--', departureTime: '15:50', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 7 },
            { stationCode: 'ST', stationName: 'Surat', arrivalTime: '19:40', departureTime: '19:45', haltMinutes: 5, distanceFromSource: 263, dayNumber: 1 },
            { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '21:55', departureTime: '22:00', haltMinutes: 5, distanceFromSource: 392, dayNumber: 1 },
            { stationCode: 'ADI', stationName: 'Ahmedabad Junction', arrivalTime: '01:00', departureTime: '01:10', haltMinutes: 10, distanceFromSource: 492, dayNumber: 2, platform: 4 },
            { stationCode: 'JP', stationName: 'Jaipur Junction', arrivalTime: '11:05', departureTime: '--', haltMinutes: 0, distanceFromSource: 1112, dayNumber: 2, platform: 1 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 1560, available: true },
            { trainClass: '3AC', baseFare: 635, available: true },
            { trainClass: 'SL', baseFare: 240, available: true },
            { trainClass: 'GN', baseFare: 140, available: false },
        ],
    },
    {
        number: '12628', name: 'Karnataka Express (Return)', category: 'Superfast',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'SBC', destinationCode: 'NDLS', totalDistance: 2444, avgSpeed: 56, pantryAvailable: true,
        stops: [
            { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '--', departureTime: '19:20', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 1 },
            { stationCode: 'SC', stationName: 'Secunderabad Jn', arrivalTime: '06:30', departureTime: '06:50', haltMinutes: 20, distanceFromSource: 790, dayNumber: 2, platform: 1 },
            { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '13:20', departureTime: '13:35', haltMinutes: 15, distanceFromSource: 1350, dayNumber: 2 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '21:00', departureTime: '21:10', haltMinutes: 10, distanceFromSource: 1740, dayNumber: 2 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '03:00', departureTime: '03:05', haltMinutes: 5, distanceFromSource: 2249, dayNumber: 3 },
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:35', departureTime: '--', haltMinutes: 0, distanceFromSource: 2444, dayNumber: 3, platform: 7 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 3065, available: true },
            { trainClass: '3AC', baseFare: 1255, available: true },
            { trainClass: 'SL', baseFare: 470, available: true },
            { trainClass: 'GN', baseFare: 280, available: false },
        ],
    },
    {
        number: '12433', name: 'Chennai Rajdhani Express', category: 'Rajdhani',
        classes: ['1AC', '2AC', '3AC'], runningDays: ['Wed', 'Fri', 'Sun'],
        sourceCode: 'NZM', destinationCode: 'MAS', totalDistance: 2180, avgSpeed: 70, pantryAvailable: true,
        stops: [
            { stationCode: 'NZM', stationName: 'Hazrat Nizamuddin', arrivalTime: '--', departureTime: '15:55', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 1 },
            { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '18:12', departureTime: '18:17', haltMinutes: 5, distanceFromSource: 195, dayNumber: 1 },
            { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '23:40', departureTime: '23:50', haltMinutes: 10, distanceFromSource: 704, dayNumber: 1 },
            { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '05:30', departureTime: '05:40', haltMinutes: 10, distanceFromSource: 1094, dayNumber: 2 },
            { stationCode: 'SC', stationName: 'Secunderabad Jn', arrivalTime: '12:40', departureTime: '12:55', haltMinutes: 15, distanceFromSource: 1654, dayNumber: 2, platform: 8 },
            { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '22:30', departureTime: '--', haltMinutes: 0, distanceFromSource: 2180, dayNumber: 2, platform: 3 },
        ],
        fares: [
            { trainClass: '1AC', baseFare: 5300, available: true },
            { trainClass: '2AC', baseFare: 3100, available: true },
            { trainClass: '3AC', baseFare: 2155, available: true },
        ],
    },
    {
        number: '16526', name: 'Bangalore Express', category: 'Express',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'SC', destinationCode: 'SBC', totalDistance: 570, avgSpeed: 48, pantryAvailable: false,
        stops: [
            { stationCode: 'SC', stationName: 'Secunderabad Jn', arrivalTime: '--', departureTime: '18:45', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 4 },
            { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '06:40', departureTime: '--', haltMinutes: 0, distanceFromSource: 570, dayNumber: 2, platform: 6 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 870, available: true },
            { trainClass: '3AC', baseFare: 355, available: true },
            { trainClass: 'SL', baseFare: 135, available: true },
            { trainClass: 'GN', baseFare: 80, available: false },
        ],
    },
    {
        number: '12785', name: 'Mysore Express', category: 'Express',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'MAS', destinationCode: 'SBC', totalDistance: 362, avgSpeed: 54, pantryAvailable: false,
        stops: [
            { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '--', departureTime: '23:00', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 9 },
            { stationCode: 'AJJ', stationName: 'Arakkonam Junction', arrivalTime: '00:05', departureTime: '00:07', haltMinutes: 2, distanceFromSource: 68, dayNumber: 2, platform: 3 },
            { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '05:40', departureTime: '--', haltMinutes: 0, distanceFromSource: 362, dayNumber: 2, platform: 3 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 640, available: true },
            { trainClass: '3AC', baseFare: 265, available: true },
            { trainClass: 'SL', baseFare: 105, available: true },
            { trainClass: 'GN', baseFare: 65, available: false },
        ],
    },
    {
        number: '19031', name: 'Haridwar Mail', category: 'Mail',
        classes: ['2AC', '3AC', 'SL', 'GN'], runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sourceCode: 'ADI', destinationCode: 'DDN', totalDistance: 1352, avgSpeed: 50, pantryAvailable: false,
        stops: [
            { stationCode: 'ADI', stationName: 'Ahmedabad Junction', arrivalTime: '--', departureTime: '06:05', haltMinutes: 0, distanceFromSource: 0, dayNumber: 1, platform: 11 },
            { stationCode: 'JP', stationName: 'Jaipur Junction', arrivalTime: '17:00', departureTime: '17:15', haltMinutes: 15, distanceFromSource: 620, dayNumber: 1, platform: 3 },
            { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '00:30', departureTime: '01:00', haltMinutes: 30, distanceFromSource: 940, dayNumber: 2, platform: 15 },
            { stationCode: 'DDN', stationName: 'Dehradun', arrivalTime: '09:10', departureTime: '--', haltMinutes: 0, distanceFromSource: 1352, dayNumber: 2, platform: 2 },
        ],
        fares: [
            { trainClass: '2AC', baseFare: 1840, available: true },
            { trainClass: '3AC', baseFare: 750, available: true },
            { trainClass: 'SL', baseFare: 280, available: true },
            { trainClass: 'GN', baseFare: 165, available: false },
        ],
    },
];

export function findTrain(number: string): Train | undefined {
    return trains.find(t => t.number === number);
}

export function searchTrains(from: string, to: string): Train[] {
    return trains.filter(train => {
        const fromIdx = train.stops.findIndex(s => s.stationCode === from);
        const toIdx = train.stops.findIndex(s => s.stationCode === to);
        return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });
}
