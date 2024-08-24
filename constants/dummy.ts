const cleaners = [
    {
        name: "John Doe",
        mobile: "1234567890",
        city: "New York",
        state: "NY",
        type: "Part-time",
        aadhar: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Jane Smith",
        mobile: "9876543210",
        city: "Los Angeles",
        state: "CA",
        type: "Full-time",
        aadhar: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Michael Johnson",
        mobile: "5678901234",
        city: "Chicago",
        state: "IL",
        type: "Part-time",
        aadhar: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Emily Davis",
        mobile: "3456789012",
        city: "Houston",
        state: "TX",
        type: "Full-time",
        aadhar: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Daniel Wilson",
        mobile: "9012345678",
        city: "Phoenix",
        state: "AZ",
        type: "Part-time",
        aadhar: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Sophia Martinez",
        mobile: "2345678901",
        city: "Miami",
        state: "FL",
        type: "Full-time",
        aadhar: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    }
];

const drivers = [
    {
        name: "John Doe",
        mobile: "1234567890",
        city: "New York",
        state: "NY",
        type: "Part-time",
        aadhar: "https://via.placeholder.com/150",
        license: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Jane Smith",
        mobile: "9876543210",
        city: "Los Angeles",
        state: "CA",
        type: "Full-time",
        aadhar: "https://via.placeholder.com/150",
        license: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Michael Johnson",
        mobile: "5678901234",
        city: "Chicago",
        state: "IL",
        type: "Part-time",
        aadhar: "https://via.placeholder.com/150",
        license: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Emily Davis",
        mobile: "3456789012",
        city: "Houston",
        state: "TX",
        type: "Full-time",
        aadhar: "https://via.placeholder.com/150",
        license: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Daniel Wilson",
        mobile: "9012345678",
        city: "Phoenix",
        state: "AZ",
        type: "Part-time",
        aadhar: "https://via.placeholder.com/150",
        license: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    },
    {
        name: "Sophia Martinez",
        mobile: "2345678901",
        city: "Miami",
        state: "FL",
        type: "Full-time",
        aadhar: "https://via.placeholder.com/150",
        license: "https://via.placeholder.com/150",
        imageUrl: "https://via.placeholder.com/100"
    }
];

const cars = [
    {
        vehicleNumber: "ABC123",
        seatingCapacity: "5",
        vehicleModel: "Toyota Corolla",
        location: "New York",
        carName: "Family Car",
        contactNumber: "123-456-7890",
        features: ["AC", "For Rent"],
        imageUrl: [
            "https://via.placeholder.com/150/0000FF",
            "https://via.placeholder.com/150/FF0000",
            "https://via.placeholder.com/150/00FF00"
        ],
    },
    {
        vehicleNumber: "XYZ456",
        seatingCapacity: "7",
        vehicleModel: "Honda Odyssey",
        location: "Los Angeles",
        carName: "Mini Van",
        contactNumber: "987-654-3210",
        features: ["Non-AC", "For Sell"],
        imageUrl: [
            "https://via.placeholder.com/150/FFFF00",
            "https://via.placeholder.com/150/FF00FF",
            "https://via.placeholder.com/150/00FFFF"
        ],
    },
    {
        vehicleNumber: "LMN789",
        seatingCapacity: "4",
        vehicleModel: "Ford Mustang",
        location: "Chicago",
        carName: "Sporty Ride",
        contactNumber: "555-555-5555",
        features: ["AC", "For Sell"],
        imageUrl: [
            "https://via.placeholder.com/150/000000",
            "https://via.placeholder.com/150/808080",
            "https://via.placeholder.com/150/C0C0C0"
        ],
    },
    {
        vehicleNumber: "QWE123",
        seatingCapacity: "5",
        vehicleModel: "Chevrolet Malibu",
        location: "Houston",
        carName: "Business Sedan",
        contactNumber: "111-222-3333",
        features: ["AC", "For Rent"],
        imageUrl: [
            "https://via.placeholder.com/150/FFA500",
            "https://via.placeholder.com/150/A52A2A",
            "https://via.placeholder.com/150/8A2BE2"
        ],
    },
    {
        vehicleNumber: "RTY456",
        seatingCapacity: "8",
        vehicleModel: "Subaru Ascent",
        location: "Phoenix",
        carName: "Big Family SUV",
        contactNumber: "444-555-6666",
        features: ["Non-AC", "For Rent"],
        imageUrl: [
            "https://via.placeholder.com/150/7FFF00",
            "https://via.placeholder.com/150/D2691E",
            "https://via.placeholder.com/150/FF7F50"
        ],
    },
];

const trucks = [
    {
        vehicleNumber: "AB123CD",
        numberOfTyres: 6,
        vehicleWeight: "10 tons",
        model: "Model X",
        bodyType: "Flatbed",
        location: "New York",
        chassisNumber: "CH123456789",
        forRentOrSell: "For Rent",
        imageUrl: [
            "https://via.placeholder.com/150/92c952",
            "https://via.placeholder.com/150/771796"
        ]
    },
    {
        vehicleNumber: "EF456GH",
        numberOfTyres: 8,
        vehicleWeight: "15 tons",
        model: "Model Y",
        bodyType: "Tanker",
        location: "Los Angeles",
        chassisNumber: "CH987654321",
        forRentOrSell: "For Sell",
        imageUrl: [
            "https://via.placeholder.com/150/24f355",
            "https://via.placeholder.com/150/d32776"
        ]
    },
    {
        vehicleNumber: "IJ789KL",
        numberOfTyres: 10,
        vehicleWeight: "20 tons",
        model: "Model Z",
        bodyType: "Refrigerated",
        location: "Chicago",
        chassisNumber: "CH123123123",
        forRentOrSell: "For Rent",
        imageUrl: [
            "https://via.placeholder.com/150/f66b97",
            "https://via.placeholder.com/150/56a8c2"
        ]
    },
    {
        vehicleNumber: "MN012OP",
        numberOfTyres: 12,
        vehicleWeight: "25 tons",
        model: "Model A",
        bodyType: "Dump",
        location: "Houston",
        chassisNumber: "CH321321321",
        forRentOrSell: "For Sell",
        imageUrl: [
            "https://via.placeholder.com/150/b0f7cc",
            "https://via.placeholder.com/150/54176f"
        ]
    }
];

const buses = [
    {
        vehicleNumber: "BC234DE",
        seatingCapacity: 50,
        vehicleModel: "Model B",
        bodyType: "Coach",
        location: "San Francisco",
        chassisNumber: "CH456456456",
        forRentOrSell: "For Rent",
        imageUrl: [
            "https://via.placeholder.com/150/66b7d2",
            "https://via.placeholder.com/150/123456"
        ]
    },
    {
        vehicleNumber: "GH567IJ",
        seatingCapacity: 60,
        vehicleModel: "Model C",
        bodyType: "Double Decker",
        location: "Miami",
        chassisNumber: "CH654654654",
        forRentOrSell: "For Sell",
        imageUrl: [
            "https://via.placeholder.com/150/456789",
            "https://via.placeholder.com/150/abcdef"
        ]
    },
    {
        vehicleNumber: "KL890MN",
        seatingCapacity: 40,
        vehicleModel: "Model D",
        bodyType: "Minibus",
        location: "Seattle",
        chassisNumber: "CH789789789",
        forRentOrSell: "For Rent",
        imageUrl: [
            "https://via.placeholder.com/150/fedcba",
            "https://via.placeholder.com/150/654321"
        ]
    },
    {
        vehicleNumber: "OP123QR",
        seatingCapacity: 45,
        vehicleModel: "Model E",
        bodyType: "Shuttle",
        location: "Denver",
        chassisNumber: "CH987987987",
        forRentOrSell: "For Sell",
        imageUrl: [
            "https://via.placeholder.com/150/89abcd",
            "https://via.placeholder.com/150/ef1234"
        ]
    }
];

const tempo = [
    {
        vehicleNumber: "BC234DE",
        seatingCapacity: 50,
        vehicleModel: "Model B",
        bodyType: "Coach",
        location: "San Francisco",
        chassisNumber: "CH456456456",
        forRentOrSell: "For Rent",
        imageUrl: [
            "https://via.placeholder.com/150/66b7d2",
            "https://via.placeholder.com/150/123456"
        ]
    },
    {
        vehicleNumber: "GH567IJ",
        seatingCapacity: 60,
        vehicleModel: "Model C",
        bodyType: "Double Decker",
        location: "Miami",
        chassisNumber: "CH654654654",
        forRentOrSell: "For Sell",
        imageUrl: [
            "https://via.placeholder.com/150/456789",
            "https://via.placeholder.com/150/abcdef"
        ]
    },
    {
        vehicleNumber: "KL890MN",
        seatingCapacity: 40,
        vehicleModel: "Model D",
        bodyType: "Minibus",
        location: "Seattle",
        chassisNumber: "CH789789789",
        forRentOrSell: "For Rent",
        imageUrl: [
            "https://via.placeholder.com/150/fedcba",
            "https://via.placeholder.com/150/654321"
        ]
    },
    {
        vehicleNumber: "OP123QR",
        seatingCapacity: 45,
        vehicleModel: "Model E",
        bodyType: "Shuttle",
        location: "Denver",
        chassisNumber: "CH987987987",
        forRentOrSell: "For Sell",
        imageUrl: [
            "https://via.placeholder.com/150/89abcd",
            "https://via.placeholder.com/150/ef1234"
        ]
    }
];

const packageData = [
    {
        vehicleNumber: 'ABC123',
        otherVehicleNumber: 'XYZ456',
        customerName: 'John Doe',
        mobileNumber: '1234567890',
        alternateNumber: '9876543210',
        kmStarting: '1000',
        perKmRate: '10',
        advancedAmount: '5000',
        remainingAmount: '2000',
        departurePlace: 'City A',
        destinationPlace: 'City B',
        departureTime: '10:00 AM',
        returnTime: '5:00 PM',
        toll: '200',
        otherStateTax: '100',
        instructions: 'Handle with care',
        addNote: 'Please note additional instructions',
        entryParking: 'Paid parking available'
    },
    {
        vehicleNumber: 'DEF456',
        otherVehicleNumber: 'PQR789',
        customerName: 'Jane Smith',
        mobileNumber: '9876543210',
        alternateNumber: '1234567890',
        kmStarting: '1500',
        perKmRate: '12',
        advancedAmount: '6000',
        remainingAmount: '2500',
        departurePlace: 'City C',
        destinationPlace: 'City D',
        departureTime: '9:00 AM',
        returnTime: '4:00 PM',
        toll: '150',
        otherStateTax: '80',
        instructions: 'Fragile items inside',
        addNote: 'Contact on arrival',
        entryParking: 'Free parking'
    },
]

const employees = [
    {
        id: 1,
        name: "John Doe",
        role: "Software Engineer",
        department: "Engineering",
        email: "john.doe@example.com",
        phone: "+1234567890",
        imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        id: 2,
        name: "Jane Smith",
        role: "UX/UI Designer",
        department: "Design",
        email: "jane.smith@example.com",
        phone: "+1987654321",
        imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
        id: 3,
        name: "Michael Johnson",
        role: "Marketing Manager",
        department: "Marketing",
        email: "michael.johnson@example.com",
        phone: "+1122334455",
        imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "HR Specialist",
        department: "Human Resources",
        email: "emily.davis@example.com",
        phone: "+1567890123",
        imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    },
];

const dailyRoutes = [
    {
        vehicleNumber: "ABC123",
        departureTime: "08:00 AM",
        cleanerName: "John Doe",
        driverName1: "Jane Smith",
        driverName2: "Michael Johnson",
        departure: "Station A",
        destination: "Station B",
    },
    {
        vehicleNumber: "DEF456",
        departureTime: "09:00 AM",
        cleanerName: "Alice Brown",
        driverName1: "Robert Wilson",
        driverName2: "Emily Davis",
        departure: "Station C",
        destination: "Station D",
    },
    {
        vehicleNumber: "GHI789",
        departureTime: "10:00 AM",
        cleanerName: "Chris Martin",
        driverName1: "David Lee",
        driverName2: "Sophia Taylor",
        departure: "Station E",
        destination: "Station F",
    },
    {
        vehicleNumber: "JKL012",
        departureTime: "11:00 AM",
        cleanerName: "Nina Walker",
        driverName1: "Brian Harris",
        driverName2: "Linda Young",
        departure: "Station G",
        destination: "Station H",
    },
    {
        vehicleNumber: "MNO345",
        departureTime: "12:00 PM",
        cleanerName: "Oscar Scott",
        driverName1: "George Hall",
        driverName2: "Anna King",
        departure: "Station I",
        destination: "Station J",
    },
];

const technicians = [
    {
        name: "John Doe",
        altNumber: "9876543210",
        type: "Electrician",
        vehicleType: "Van"
    },
    {
        name: "Jane Smith",
        altNumber: "8765432109",
        type: "Plumber",
        vehicleType: "Truck"
    },
    {
        name: "Michael Johnson",
        altNumber: "7654321098",
        type: "HVAC Technician",
        vehicleType: "SUV"
    },
    {
        name: "Emily Davis",
        altNumber: "6543210987",
        type: "Carpenter",
        vehicleType: "Pickup"
    },
    {
        name: "Robert Wilson",
        altNumber: "5432109876",
        type: "Technician",
        vehicleType: "Car"
    },
];

const vehicleDocuments = [
    {
        number: "KA01AB1234",
        imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        rcUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        insuranceUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        permitUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        fitnessUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        taxUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        pucUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
        number: "DL05CD5678",
        imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        rcUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        insuranceUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        permitUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        fitnessUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        taxUrl: "https://randomuser.me/api/portraits/women/2.jpg",
        pucUrl: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
        number: "MH12EF9012",
        imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        rcUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        insuranceUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        permitUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        fitnessUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        taxUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        pucUrl: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
        number: "TN22GH3456",
        imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        rcUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        insuranceUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        permitUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        fitnessUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        taxUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        pucUrl: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
        number: "GJ01IJ7890",
        imageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
        rcUrl: "https://randomuser.me/api/portraits/men/5.jpg",
        insuranceUrl: "https://randomuser.me/api/portraits/men/5.jpg",
        permitUrl: "https://randomuser.me/api/portraits/men/5.jpg",
        fitnessUrl: "https://randomuser.me/api/portraits/men/5.jpg",
        taxUrl: "https://randomuser.me/api/portraits/men/5.jpg",
        pucUrl: "https://randomuser.me/api/portraits/men/5.jpg"
    }
];



const serviceRecords = [
    {
        vehicleNumber: "AB123CD",
        garageNumber: "G01",
        garageName: "Super Garage",
        date: "2023-05-21",
        workDetails: "Oil change, Tire rotation",
        billUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        vehicleNumber: "EF456GH",
        garageNumber: "G02",
        garageName: "Mega Garage",
        date: "2023-06-10",
        workDetails: "Brake replacement, Battery check",
        billUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
        vehicleNumber: "IJ789KL",
        garageNumber: "G03",
        garageName: "Ultra Garage",
        date: "2023-07-05",
        workDetails: "Engine tuning, Wheel alignment",
        billUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
        vehicleNumber: "MN012OP",
        garageNumber: "G04",
        garageName: "Hyper Garage",
        date: "2023-08-15",
        workDetails: "Transmission repair, Exhaust replacement",
        billUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
        vehicleNumber: "QR345ST",
        garageNumber: "G05",
        garageName: "Prime Garage",
        date: "2023-09-25",
        workDetails: "Air conditioning repair, Fuel system cleaning",
        billUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    },
];

const sell_cars = [
    {
        vehicleNumber: "ABC1234",
        vehicleModel: "Toyota Camry",
        contactNumber: "123-456-7890",
        location: "New York, NY",
        imageUrl: [
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/178535/c-class-exterior-right-front-three-quarter.jpeg?isig=0&q=80",
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/178535/c-class-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80",
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/178535/c-class-exterior-right-side-view.jpeg?isig=0&q=80",
        ],
    },
    {
        vehicleNumber: "XYZ5678",
        vehicleModel: "Honda Accord",
        contactNumber: "987-654-3210",
        location: "Los Angeles, CA",
        imageUrl: [
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/149525/a-class-limousine-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80",
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/149525/a-class-limousine-exterior-rear-view.jpeg?isig=0&q=80",
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/153749/mercedes-benz-a-class-limousine-right-front-three-quarter13.jpeg?isig=0&wm=1&q=80",
        ],
    },
];


export { cleaners, drivers, cars, trucks, buses, serviceRecords, sell_cars,
    tempo, packageData, employees, dailyRoutes, technicians, vehicleDocuments }